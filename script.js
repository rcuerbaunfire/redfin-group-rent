$(document).ready(function () {
    console.log('bf script init');

    function animatedTop() {
        const fadedElements = gsap.utils.toArray(".transition-top");
        if (fadedElements.length) {
            fadedElements.forEach((el) => {
                gsap.fromTo(el,
                    {
                        autoAlpha: 0,
                        y: 20,
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 65%",
                            duration: 0.8,
                            overwrite: true,
                            ease: Power2.easeOut,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            });
        }
    }

    function animatedFade() {
        const fadedElements = gsap.utils.toArray(".transition-fade");
        if (fadedElements.length) {
            fadedElements.forEach((el) => {
                gsap.fromTo(el,
                    {
                        autoAlpha: 0,
                    },
                    {
                        autoAlpha: 1,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 65%",
                            duration: 0.8,
                            overwrite: true,
                            ease: Power2.easeOut,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            });
        }
    }

    function refresh(firstLoad = false) {
        if (firstLoad) {
            $('body').imagesLoaded()
                .always(function (instance) {
                    console.log('all images loaded');
                })
                .done(function (instance) {
                    const triggers = ScrollTrigger.getAll();
                    triggers.forEach(trigger => {
                        trigger.refresh(true);
                    });
                })
                .fail(function () {
                    //
                })
                .progress(function (instance, image) {
                    //
                });
        } else {
            const triggers = ScrollTrigger.getAll();
            triggers.forEach(trigger => {
                trigger.refresh(true);
            });
        }
    }

    function nav() {
        const nav = $(".w-nav");

        function navSlideIn() {
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                gsap.fromTo(nav,
                    {
                        autoAlpha: 0,
                        y: "-100%",
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: Power2.easeOut
                    }
                );
            }
        }

        function preventScroll() {
            const trigger = $(".navbar_mob_btn");
            const bodyEl = $("body");

            const mm = gsap.matchMedia();

            mm.add(
                {
                    isDesktop: `(min-width: 991px)`,
                    isMobile: `(max-width: 990px)`,
                },
                (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isMobile) {
                        trigger.click(function () {
                            if (nav.hasClass("active")) {
                                nav.removeClass("active");
                                bodyEl.removeClass("no-scroll");
                            } else {
                                nav.addClass("active");
                                bodyEl.addClass("no-scroll");
                            }
                        });
                    }

                    if (isDesktop) {
                        nav.removeClass("active");
                        bodyEl.removeClass("no-scroll");
                    }

                    return () => { };
                }
            );
        }

        function dropdown() {
            const dds = $(".main-nav-dd");

            dds.hover(
                function () {
                    nav.addClass("hovering");
                }, function () {
                    nav.removeClass("hovering");
                }
            );
        }

        function mobileAcc() {
            const mobileBtn = nav.find(".navbar_mob_btn");
            const allItems = nav.find(".navbar_mob_dd");

            const mm = gsap.matchMedia();
            let carouselInstance = null;

            mm.add(
                {
                    isDesktop: `(min-width: 1161px)`,
                    isMobile: `(max-width: 1160px)`,
                },
                (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isDesktop) {
                        nav.removeClass("mob-active");
                    }

                    if (isMobile) {
                        nav.removeClass("searching");
                    }

                    return () => { };
                }
            );

            mobileBtn.click(function () {
                nav.toggleClass("mob-active");
            });

            allItems.each(function () {
                const subSelf = $(this);
                const head = subSelf.find(".navbar_mob_dd_head");
                const body = subSelf.find(".navbar_mob_dd_body");

                head.click(function () {
                    if (!subSelf.hasClass("open")) {
                        subSelf.addClass("open");
                        gsap.fromTo(body,
                            {
                                height: 0,
                                autoAlpha: 0,
                            },
                            {
                                height: "auto",
                                duration: 0.4,
                                autoAlpha: 1,
                                ease: Power2.easeOut,
                                overwrite: true
                            }
                        )
                    } else {
                        subSelf.removeClass("open");

                        gsap.to(body, {
                            height: 0,
                            duration: 0.4,
                            ease: Power2.easeOut,
                            overwrite: true,
                            onStart: () => {
                                gsap.set(body, {
                                    autoAlpha: 0,
                                });
                            },
                        });
                    }
                });
            });
        }

        function search() {
            const search = nav.find(".navbar_search_btn.is-desktop");

            search.click(function () {
                nav.toggleClass("searching");
            });
        }

        navSlideIn();
        preventScroll();
        dropdown();
        mobileAcc();
        search();
    }

    function handleVideo() {
        const containers = $(".video-block, .hero");
        if (!containers.length) return;

        attachScript();

        function loadVideos() {
            containers.each(function () {
                const self = $(this);
                const videoID = self.find("#video-id").text();
                const videoBox = self.find(".vimeo-container");
                const videoThumb = self.find(".vimeo-thumb");

                if (!videoBox.length && !videoID) return;

                var player = new Vimeo.Player(videoBox, {
                    id: videoID,
                    controls: false,
                    autoplay: true,
                    muted: true,
                    background: true,
                    referrerpolicy: "origin",
                    loop: true
                });

                if (self.hasClass("hero")) {
                    let visible = true;

                    player.getDuration().then(function (duration) {
                        var lastFrameTime = duration - 0.05;

                        player.on('timeupdate', function (data) {
                            if (visible) {
                                videoThumb.fadeOut();
                                visible = false;
                            }

                            if (data.seconds >= lastFrameTime) {
                                player.pause().then(function () {
                                    player.setCurrentTime(lastFrameTime);
                                }).catch(function (error) {
                                    console.error('Error pausing the video:', error);
                                });

                                player.off('timeupdate');
                            }
                        });
                    }).catch(function (error) {
                        console.error('Error getting video duration:', error);
                    });
                } else {
                    const globalCTA = self.find(".global-cta.vid-play");
                    const itemsToHide = self.find(".video-description-container, .video-overlay");

                    globalCTA.click(function () {
                        player.destroy().then(function () {
                            itemsToHide.fadeOut();
                            player = new Vimeo.Player(videoBox, {
                                id: videoID,
                                controls: true,
                                autoplay: true,
                                muted: false,
                                referrerpolicy: "origin",
                            });
                        }).catch(function (error) {
                            console.error('Error unloading the player:', error);
                        });
                    })
                }
            });
        }

        function attachScript() {
            const tag = document.createElement('script');
            tag.src = `https://player.vimeo.com/api/player.js`;
            tag.async = true;
            tag.id = "vimeo-script"
            const targetScriptTag = document.getElementsByTagName('script')[1];
            targetScriptTag.parentNode.insertBefore(tag, targetScriptTag);

            tag.onload = function () {
                loadVideos();
            }
        }
    };

    function duplicatesForMobile() {
        function featureCards() {
            const container = $(".feature-cards");
            if (!container.length) return;

            container.each(function () {
                const self = $(this);
                const targetContainer = self.find(".fc-inner.mobile-owl-carousel");
                const whiteboxes = self.find(".whitebox")
                whiteboxes.clone().appendTo(targetContainer);
            });
        }

        function featureCardsDark() {
            const container = $(".feature-cards-dark");
            if (!container.length) return;

            container.each(function () {
                const self = $(this);
                const targetContainer = self.find(".fc-inner.mobile-owl-carousel");
                const darkboxes = self.find(".darkbox")
                darkboxes.clone().appendTo(targetContainer);
            });
        }

        featureCards();
        featureCardsDark();
    }

    function carousels() {
        const carousels = $(".owl-carousel, .mobile-owl-carousel");
        if (!carousels.length) return;

        const leftArrow = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" transform="matrix(-1 0 0 1 32 0)" fill="#4561EC"/><path d="M24 16L9.60001 16" stroke="#F6F6FF" stroke-width="2.00439"/><path d="M15.9996 9.6001L9.59961 16.0001L15.9996 22.4001" stroke="#F6F6FF" stroke-width="2.00439"/></svg>`;
        const rightArrow = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#4561EC"/><path d="M8 16L22.4 16" stroke="#F6F6FF" stroke-width="2.00439"/><path d="M16.0004 9.6001L22.4004 16.0001L16.0004 22.4001" stroke="#F6F6FF" stroke-width="2.00439"/></svg>`;

        carousels.each(function () {
            const self = $(this);

            if (self.hasClass("tes-items")) {
                if (self.children().length > 1) {
                    const carouselInstance = self.owlCarousel({
                        nav: true,
                        smartSpeed: 1000,
                        items: 1,
                        loop: true,
                        navRewind: false,
                        dotsEach: true,
                        navText: [leftArrow, rightArrow],
                        margin: 60,
                    });

                    const dots = self.find(".owl-dot");
                    dots.each(function (index) {
                        const dot = $(this);
                        const num = index + 1;

                        if (num == dots.length) {
                            dot.children().remove();
                            dot.html(`<span>${num}</span>/<span>${num}</span>`);
                        } else {
                            dot.children("span").text(num);
                        }
                    });
                } else {
                    self.removeClass("owl-carousel");
                    self.addClass("no-carousel");
                }

            } else if (self.hasClass("sol-items")) {
                const carouselInstance = self.owlCarousel({
                    nav: true,
                    smartSpeed: 1000,
                    loop: false,
                    navRewind: false,
                    dotsEach: true,
                    navText: [leftArrow, rightArrow],
                    responsive: {
                        0: { margin: 16, items: 1 },
                        768: { items: 2, margin: 24 },
                        1280: { items: 3, margin: 24 },
                    },
                });

            } else if (self.hasClass("res-items")) {
                const mm = gsap.matchMedia();
                let carouselInstance = null;

                mm.add(
                    {
                        isDesktop: `(min-width: 768px)`,
                        isMobile: `(max-width: 767px)`,
                    },
                    (context) => {
                        let { isDesktop, isMobile } = context.conditions;

                        if (isMobile) {
                            if (!self.hasClass("owl-loaded")) {
                                carouselInstance = self.owlCarousel({
                                    nav: true,
                                    navText: [leftArrow, rightArrow],
                                    items: 1,
                                    smartSpeed: 1000,
                                    loop: false,
                                    navRewind: false,
                                    dotsEach: true,
                                    margin: 16,
                                });
                            }
                        }

                        if (isDesktop) {
                            if (carouselInstance) {
                                carouselInstance.trigger(
                                    "destroy.owl.carousel"
                                );
                                carouselInstance = null;
                            }
                        }

                        return () => { };
                    }
                );

            } else if (self.hasClass("fc-items")) {
                const mm = gsap.matchMedia();
                let carouselInstance = null;

                mm.add(
                    {
                        isDesktop: `(min-width: 768px)`,
                        isMobile: `(max-width: 767px)`,
                    },
                    (context) => {
                        let { isDesktop, isMobile } = context.conditions;

                        if (isMobile) {
                            if (!self.hasClass("owl-loaded")) {
                                carouselInstance = self.owlCarousel({
                                    nav: true,
                                    items: 1,
                                    smartSpeed: 1000,
                                    loop: false,
                                    navRewind: false,
                                    dotsEach: true,
                                    margin: 12,
                                    navText: [leftArrow, rightArrow],
                                });
                            }
                        }

                        if (isDesktop) {
                            if (carouselInstance) {
                                carouselInstance.trigger(
                                    "destroy.owl.carousel"
                                );
                                carouselInstance = null;
                            }
                        }

                        return () => { };
                    }
                );

            } else if (self.hasClass("sh-items")) {
                const carouselInstance = self.owlCarousel({
                    nav: true,
                    smartSpeed: 1000,
                    loop: false,
                    navRewind: false,
                    dotsEach: true,
                    items: 1,
                    autoWidth: true,
                    navText: [leftArrow, rightArrow],
                    responsive: {
                        0: { margin: 16 },
                        990: { margin: 32 },
                    },
                });

            } else if (self.hasClass("lp-items")) {
                const mm = gsap.matchMedia();
                const overflowable = self.children().length > 4;
                let carouselInstance = null;

                mm.add(
                    {
                        isDesktop: `(min-width: 1366px)`,
                        isMobile: `(max-width: 1365px)`,
                    },
                    (context) => {
                        let { isDesktop, isMobile } = context.conditions;

                        if (isMobile) {
                            self.addClass("owl-carousel");
                            self.removeClass("no-owl-carousel");

                            if (!self.hasClass("owl-loaded")) {
                                carouselInstance = self.owlCarousel({
                                    nav: true,
                                    smartSpeed: 1000,
                                    loop: false,
                                    navRewind: false,
                                    dotsEach: true,
                                    navText: [leftArrow, rightArrow],
                                    responsive: {
                                        0: { autoWidth: false, margin: 12, items: 1 },
                                        768: { autoWidth: true, margin: 24 },
                                        1366: { autoWidth: true, margin: 24 },
                                    },
                                });
                            }
                        }

                        if (isDesktop) {
                            if (overflowable) {
                                self.removeClass("no-owl-carousel");

                                const carouselInstance = self.owlCarousel({
                                    nav: true,
                                    smartSpeed: 1000,
                                    loop: false,
                                    navRewind: false,
                                    dotsEach: true,
                                    navText: [leftArrow, rightArrow],
                                    responsive: {
                                        0: { autoWidth: false, margin: 12, items: 1 },
                                        768: { autoWidth: true, margin: 24 },
                                        1366: { autoWidth: true, margin: 24 },
                                    },
                                });
                            } else {
                                self.removeClass("owl-carousel");
                                self.addClass("no-owl-carousel");

                                if (carouselInstance) {
                                    carouselInstance.trigger(
                                        "destroy.owl.carousel"
                                    );
                                    carouselInstance = null;
                                }
                            }
                        }

                        return () => { };
                    }
                );



            } else if (self.hasClass("ar-items")) {
                const carouselInstance = self.owlCarousel({
                    nav: true,
                    autoWidth: true,
                    smartSpeed: 1000,
                    loop: false,
                    items: 1,
                    navRewind: false,
                    dotsEach: true,
                    navText: [leftArrow, rightArrow],
                    responsive: {
                        0: { margin: 20 },
                        768: { margin: 24 },
                    },
                });
            }
        });
    }

    function animatedContactHeading() {
        const container = $(".ach-to-show-container");
        if (!container.length) return;

        container.each(function () {
            const self = $(this);
            const toExit = self.find(".ach-to-exit");
            const toShowMain = self.find(".ach-to-show-main");
            const toShowSecondary = self.find(".ach-to-show");

            const timeline = gsap.timeline({
                defaults: {
                    ease: Power3.easeOut,
                    overwrite: true
                }
            });

            timeline
                .fromTo(toExit,
                    {
                        clipPath: "inset(0% 0% 0% 0%)",
                        autoAlpha: 1,
                    },
                    {
                        delay: 1,
                        clipPath: "inset(0% 0% 100% 0%)",
                        autoAlpha: 0,
                        duration: 0.8,
                    },
                )
                .fromTo(toShowMain,
                    {
                        autoAlpha: 0
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.8,
                    },
                    "<0.7"
                )
                .fromTo(toShowSecondary,
                    {
                        height: 0
                    },
                    {
                        height: "auto",
                        duration: 0.6,
                        stagger: 0.2
                    },
                    "<0.7"
                )
        })
    }

    function solutionAccordion() {
        const containers = $(".solutions-accordion");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const allItems = self.find(".cl-accordion-data");
            const allImages = self.find(".sol-acc-img.is-desktop");
            const allBody = self.find(".cl-accordion-desc");

            addIndex(allItems);
            addIndex(allImages);

            allItems.click(function () {
                const subSelf = $(this);
                const index = subSelf.data("index");

                const targetImage = allImages.filter(function () {
                    return $(this).data('index') === index;
                });

                if (!subSelf.hasClass("open")) {
                    const body = subSelf.find(".cl-accordion-desc");

                    resetItems(allBody);
                    allItems.removeClass("open");

                    allImages.removeClass("active");
                    targetImage.addClass("active");

                    subSelf.addClass("open");
                    gsap.fromTo(body,
                        {
                            height: 0,
                            autoAlpha: 0,
                        },
                        {
                            height: "auto",
                            duration: 0.6,
                            autoAlpha: 1,
                            ease: Power2.easeOut,
                            overwrite: true
                        }
                    )
                }
            });

            allItems[0].click();
        })

        function addIndex(items) {
            items.each(function (index) {
                const self = $(this);
                self.data('index', index);
            })
        }

        function resetItems(items) {
            items.each(function () {
                const self = $(this);

                gsap.to(self, {
                    height: 0,
                    duration: 0.6,
                    ease: Power2.easeOut,
                    overwrite: true,
                    onStart: () => {
                        gsap.set(self, {
                            autoAlpha: 0,
                        });
                    },
                });
            })
        }
    }

    function faq() {
        const containers = $("section.faq");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const allItems = self.find(".faq-item");

            allItems.click(function () {
                const subSelf = $(this);
                const body = subSelf.find(".faq-body");

                if (!subSelf.hasClass("open")) {
                    subSelf.addClass("open");
                    gsap.fromTo(body,
                        {
                            height: 0,
                            autoAlpha: 0,
                        },
                        {
                            height: "auto",
                            duration: 0.6,
                            autoAlpha: 1,
                            ease: Power2.easeOut,
                            overwrite: true
                        }
                    )
                } else {
                    subSelf.removeClass("open");
                    gsap.to(body, {
                        height: 0,
                        duration: 0.6,
                        ease: Power2.easeOut,
                        overwrite: true,
                        onStart: () => {
                            gsap.set(body, {
                                autoAlpha: 0,
                            });
                        },
                    });
                }
            });
        });
    }

    function packages() {
        const containers = $(".listing-package");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const allItems = self.find(".lp-item");
            const allFeatContainers = self.find(".lp-feat");
            const allFeatItem = allFeatContainers.find("li");

            allItems.each(function () {
                const subSelf = $(this);
                const overlay = subSelf.find(".lp-arrow");
                const featContainer = subSelf.find(".lp-feat");

                if (featContainer[0].scrollHeight > featContainer.innerHeight()) {
                    subSelf.addClass("has-overflow");
                }

                overlay.click(function () {
                    allItems.toggleClass("open");

                    if (allItems.hasClass("open")) {
                        gsap.fromTo(
                            allFeatContainers,
                            {
                                height: 186,
                            },
                            {
                                height: "auto",
                                duration: 0.6,
                                ease: Power2.easeOut,
                                overwrite: true,
                            }
                        );
                    } else {
                        gsap.to(allFeatContainers, {
                            height: 186,
                            duration: 0.6,
                            ease: Power2.easeOut,
                            overwrite: true
                        });
                    }
                });
            });

            allFeatItem.prepend(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.5 7L9.50009 17.0001L4.5 12" stroke="#7E93FB" stroke-width="1.5"/></svg>`);
        })
    }

    function heroSlideIn() {
        const containers = $("section.hero");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const heroRight = self.find(".hero-right-container");
            const heroLeft = self.find(".hero-left-container");

            gsap.timeline()
                .fromTo(
                    heroLeft,
                    {
                        autoAlpha: 0,
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.6,
                        ease: Power2.easeOut
                    }
                )
                .to(
                    heroRight,
                    {
                        delay: 0.4,
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: 0.8,
                        ease: Power2.easeOut
                    },
                    "<0.2"
                )
        })
    }

    function LogoSlideIn() {
        const containers = $(".pl-logo-container.is-home");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);

            gsap.fromTo(self,
                {
                    autoAlpha: 0,
                    y: 30,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    ease: Power3.easeOut,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: self,
                        start: "top 65%",
                        invalidateOnRefresh: true,
                    },
                },
            )
        })
    }

    function ctaBoxSlideIn() {
        const containers = $(".gs-container");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);

            gsap.to(self, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                overwrite: true,
                ease: Power2.easeOut,
                scrollTrigger: {
                    trigger: self,
                    start: "top 65%",
                    invalidateOnRefresh: true,
                },
            })
        })
    }

    function resItemsSlideIn() {
        const containers = $(".w-layout-blockcontainer.resources");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const items = self.find(".res-items .w-dyn-item");

            const mm = gsap.matchMedia();

            mm.add(
                {
                    isDesktop: `(min-width: 768px)`,
                    isMobile: `(max-width: 767px)`,
                },
                (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isMobile) {
                        gsap.set(items, {
                            autoAlpha: 1,
                            y: 0,
                        });
                    }

                    if (isDesktop) {
                        gsap.fromTo(items,
                            {
                                autoAlpha: 0,
                                y: 30,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.8,
                                stagger: { each: 0.3 },
                                scrollTrigger: {
                                    trigger: self,
                                    start: "top 30%",
                                    invalidateOnRefresh: true,
                                },
                            }
                        );
                    }

                    return () => { };
                }
            );
        })
    }

    function propFixedScrollSlideIn() {
        const containers = $("section.prop-fixed-scroll");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const items = self.find(".pfp-item");

            items.each(function () {
                const subSelf = $(this);

                gsap.to(subSelf, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: subSelf,
                        start: "top 65%",
                        invalidateOnRefresh: true,
                    },
                });
            })
        })
    }

    function fiftyFiftyStatsSlideIn() {
        const containers = $("section._50-50-stats-img");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const items = self.find(".ff-cell");

            const tl = gsap.timeline({
                defaults: {
                    overwrite: true
                },
                scrollTrigger: {
                    trigger: self,
                    start: "top 70%"
                }
            });

            items.each(function () {
                const subSelf = $(this);
                const item = subSelf.find(".ff-box");
                const content = subSelf.find(".ff-content");
                const logo = subSelf.find(".cl-logo");
                const note = subSelf.find(".solutions-footnote");
                const line = subSelf.find(".line-white");

                tl
                    .fromTo(item,
                        {
                            autoAlpha: 0,
                            y: 30,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            ease: Power3.easeOut,
                            duration: 0.6
                        },
                        "<0.1"
                    )
                    .fromTo(logo,
                        {
                            autoAlpha: 0,
                            y: 20,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            ease: Power3.easeOut,
                            duration: 0.4
                        },
                        "<0.3"
                    )
                    .fromTo(content,
                        {
                            autoAlpha: 0,
                            y: 20,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            ease: Power3.easeOut,
                            duration: 0.6
                        },
                        "<0.2"
                    )
                    .fromTo(line,
                        {
                            width: 0,
                            autoAlpha: 0,
                        },
                        {
                            width: "100%",
                            autoAlpha: 1,
                            duration: 0.8,
                        },
                        "<0.2"
                    )
                    .fromTo(note,
                        {
                            autoAlpha: 0,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            ease: Power3.easeOut,
                            duration: 0.4
                        },
                        "<0.2"
                    )
            })
        })
    }

    function allResources() {
        const containers = $(".all-resource-carousel");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const arList = self.find(".ar-list");
            const arInner = self.find(".ar-inner");
            const arListInner = self.find(".ar-list-inner");
            const arLinks = self.find(".ar-list-item");
            const arCarousels = self.find(".ar-carousel");
            let mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 991px)`,
                isMobile: `(max-width: 990px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;
                let scrollingST = null;

                if (isDesktop) {
                    if (scrollingST) {
                        scrollingST.disable(true);
                        scrollingST = null;
                    }

                    scrollingST = ScrollTrigger.create({
                        pin: true,
                        start: "top 160px",
                        trigger: arListInner,
                        endTrigger: arList,
                        invalidateOnRefresh: true,
                        end: () => "+=" + (arList.outerHeight() - arListInner.outerHeight()),
                    });
                }

                if (isMobile) {
                    if (scrollingST) {
                        scrollingST.disable(true);
                        scrollingST = null;
                    }

                    scrollingST = ScrollTrigger.create({
                        pin: arList,
                        start: "top 107px",
                        end: "bottom top",
                        trigger: arInner,
                        invalidateOnRefresh: true,
                    });
                }

                return () => { }
            });

            arLinks.first().addClass("active");

            arLinks.click(function () {
                const subSelf = $(this);
                if (subSelf.hasClass("active")) return;

                const key = subSelf.data("ar");
                const trigger = self.find(`.ar-carousel[data-ar="${key}"]`);
                if (!trigger.length) return;

                arLinks.removeClass("active");
                subSelf.addClass("active");

                mm.add({
                    isDesktop: `(min-width: 991px)`,
                    isMobile: `(max-width: 990px)`,
                }, (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    gsap.to(window, {
                        scrollTo: {
                            offsetY: isDesktop ? 160 : 200,
                            y: trigger,
                        },
                        ease: Power3.easeOut,
                        duration: 0.4,
                    });

                    return () => { }
                });
            });

            arCarousels.each(function () {
                const subSelf = $(this);
                const key = subSelf.data("ar");
                const target = self.find(`.ar-list-item[data-ar="${key}"]`);

                if (!key.length) return;

                ScrollTrigger.create({
                    start: "top center",
                    trigger: subSelf,
                    onEnter: () => {
                        arLinks.removeClass("active");
                        target.addClass("active");
                    },
                    onLeaveBack: () => {
                        const prevSibling = subSelf.prev();

                        if (prevSibling.length) {
                            arLinks.removeClass("active");
                            target.prev().addClass("active");
                        }
                    },
                });
            })
        });
    }

    function solHero() {
        const containers = $(".solutions-hero");
        if (!containers.length) return;

        containers.each(function () {
            const self = $(this);
            const targetContainer = self.find(".sh-scenery.placeholder");

            const paramImage = self.find(".image-sol");
            paramImage.attr("class", "sh-scenery");

            targetContainer.each(function () {
                const subSelf = $(this);
                paramImage.clone().insertBefore(subSelf);
                subSelf.remove();
            });
        });
    }

    function removeEmpties() {
        function emptyCTA() {
            const items = $(".cta.is-lp.w-dyn-bind-empty");
            items.parent().remove();
        }

        function emptyStats() {
            const items = $(".kf-stats");

            items.each(function () {
                const self = $(this);
                const empties = self.find(".w-dyn-bind-empty");

                if (empties.length >= 6) {
                    self.remove();
                }
            })
        }

        emptyCTA();
        emptyStats();
    }

    function blogCleanup() {
        const container = $(".blog-content");
        if (!container.length) return;

        const emptyElements = container.find("div:empty, p:empty");
        emptyElements.remove();
    }

    animatedFade();
    animatedTop();
    nav();
    duplicatesForMobile();
    solHero();
    carousels();
    handleVideo();
    animatedContactHeading();
    solutionAccordion();
    faq();
    packages();
    heroSlideIn();
    LogoSlideIn();
    ctaBoxSlideIn();
    resItemsSlideIn();
    propFixedScrollSlideIn();
    fiftyFiftyStatsSlideIn();
    allResources();
    removeEmpties();
    blogCleanup();
    refresh(true);
});