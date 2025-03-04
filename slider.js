document.addEventListener("DOMContentLoaded", function () {
    const sliderWrapper = document.querySelector(".slider-wrapper");
    const sliderContent = document.querySelector(".slider-content");
    const slides = document.querySelectorAll(".slide");
    const slideIndicator = document.getElementById("slideIndicator");
    let currentIndex = 0;
    let isAnimating = false;
    let isSliderActive = false;
    let isSliderFinished = false;
    let lastScrollTime = 0;


    function disableScroll() {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    }

    function enableScroll() {
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
    }


    function updateSlider() {
        sliderContent.style.transition = "transform 0.9s ease-out";
        sliderContent.style.transform = `translateX(-${currentIndex * 100}vw)`;
        slideIndicator.textContent = `${currentIndex + 1} / ${slides.length}`;

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function nextSlide() {
        if (currentIndex < slides.length - 1) {
            isAnimating = true;
            currentIndex++;
            updateSlider();
        } else {

            isSliderFinished = true;
            enableScroll();
            window.removeEventListener("wheel", scrollSlider);
        }
    }


    function prevSlide() {
        if (currentIndex > 0) {
            isAnimating = true;
            currentIndex--;
            updateSlider();
        } else {

            if (isSliderFinished) {

                isSliderFinished = false;
                enableScroll();
                window.removeEventListener("wheel", scrollSlider);
            }
        }
    }

    function scrollSlider(event) {
        const currentTime = new Date().getTime();

        if (!lastScrollTime) {
            lastScrollTime = currentTime;
        }

        if (isAnimating) return;
        event.preventDefault();

        if (currentTime - lastScrollTime > 500) {
            if (event.deltaY > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            lastScrollTime = currentTime;
        }
    }

    function checkSliderInView() {
        const rect = slideIndicator.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top <= windowHeight && rect.bottom >= 0) {
            if (!isSliderActive) {
                isSliderActive = true;
                disableScroll();
                window.addEventListener("wheel", scrollSlider, { passive: false });
            }
        } else {
            isSliderActive = false;
            enableScroll();
            window.removeEventListener("wheel", scrollSlider);
        }
    }


    function checkScrollDirection(event) {
        if (isSliderFinished && event.deltaY < 0) {

            isSliderFinished = false;
            enableScroll();
            window.removeEventListener("wheel", scrollSlider);
        }
    }

    window.addEventListener("scroll", checkSliderInView);
    window.addEventListener("wheel", checkScrollDirection, { passive: false });

    window.addEventListener("wheel", function (event) {
        if (isSliderActive && !isSliderFinished) {
            scrollSlider(event);
        } else {
            if (currentIndex === 0 && event.deltaY < 0) {
                enableScroll();
                window.removeEventListener("wheel", scrollSlider);
            }
        }
    }, { passive: false });
});
