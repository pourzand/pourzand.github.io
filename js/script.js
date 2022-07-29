!(function (e) {
    "undefined" != typeof NodeList && NodeList.prototype && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach),
        document.querySelectorAll(".ga-ce").forEach(function (e, t) {
            e.addEventListener("click", function () {
                var e = this.dataset.category ? this.dataset.category : null,
                    t = this.dataset.action ? this.dataset.action : null,
                    a = this.dataset.label ? this.dataset.label : null,
                    n = this.dataset.value ? this.dataset.value : 1;
                window.ga && ga.create && ga("send", "event", e, t, a, n, null);
            });
        });
    ({
        triggers: e(".share-popup"),
        init: function () {
            var t = this;
            t.triggers.click(function (a) {
                a.preventDefault(), t.popup(e(this).attr("href"));
            });
        },
        popup: function (e) {
            (popupWindow = window.open(e, "", "width=600,height=400")), popupWindow.focus();
        },
    }.init());
    var t = {
        view: e(".screen"),
        bios: e(".screen .bios"),
        started: !1,
        loading: { audio: !1, video: !1 },
        ambientAudio: new Audio("sound/ambient.mp3"),
        audioPlayer: document.createElement("audio"),
        text: [
            "<p>SEENA OS</p><p>Copyright (c) 2002, 2022. All Rights Reserved</p><p>BIOS Version: 01102002 Release 20</p><br />",
            "<p>Battery Pack: 98% OK</p>",
            "<p>Memory Test: 16384K OK</p>",
            "<p>Installing Packages ... Done</p>",
            "<p>New device found</p>",
            "<br /><br />",
            "<p>Press Any Key to boot system</p>",
        ],
        actionHandlers: [
            [
                "play",
                () => {
                    this.resumeTrack();
                },
            ],
            [
                "pause",
                () => {
                    this.pauseTrack();
                },
            ],
            [
                "stop",
                () => {
                    this.stopTrack();
                },
            ],
        ],
        init: function () {
            var a = this;
            a.setBodyHeight();
            var n = navigator.userAgent.toLowerCase();
            (a.isIPhone = -1 != n.indexOf("iphone")),
                a.displayTime(),
                setTimeout(function () {
                    a.boot();
                }, 100);
            for (const [e, t] of a.actionHandlers)
                try {
                    navigator.mediaSession.setActionHandler(e, t);
                } catch (t) {
                    console.log(`The media session action "${e}" is not supported yet.`);
                }
            e(window).on("keyup click", function (n) {
                t.started ||
                    (a.bios.hide(),
                    a.setLoading(!0),
                    setTimeout(function () {
                        e(".login").addClass("loaded"), a.setLoading(!1);
                    }, 1500),
                    (t.started = !0));
            }),
                (a.ambientAudio.loop = !0),
                (a.ambientAudio.volume = 0),
                a.ambientAudio.addEventListener("timeupdate", function () {
                    this.currentTime > this.duration - 0.44 && ((this.currentTime = 0), this.play());
                }),
                e(a.audioPlayer).on("ended", function () {
                    a.stopTrack();
                }),
                e(a.audioPlayer).on("stalled", function () {
                    console.log("audio stalled"), this.load();
                }),
                e("#video").on("stalled", function () {
                    console.log("video stalled"), this.load();
                }),
                "mediaSession" in navigator &&
                    (navigator.mediaSession.setActionHandler("pause", () => {
                        a.pauseTrack();
                    }),
                    navigator.mediaSession.setActionHandler("play", () => {
                        a.resumeTrack();
                    }),
                    navigator.mediaSession.setActionHandler("seekto", (e) => {
                        a.audioPlayer.currentTime = e.seekTime;
                    }));
        },
        setBodyHeight: function () {
            e("body").css("height", window.innerHeight), setTimeout(this.setBodyHeight, 100);
        },
        setLoading: function (t) {
            t ? e("body").addClass("loading") : e("body").removeClass("loading");
        },
        formatAMPM: function (e) {
            var t = e.getHours(),
                a = e.getMinutes(),
                n = t >= 12 ? "PM" : "AM";
            return (t = (t %= 12) || 12) + ":" + (a = a < 10 ? "0" + a : a) + n + "<span> - " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][e.getMonth()] + ". " + e.getDate() + ", 2002</span>";
        },
        displayTime: function () {
            var t = this,
                a = t.formatAMPM(new Date());
            e("#time").html(a),
                setTimeout(function () {
                    t.displayTime();
                }, 1e3);
        },
        boot: function () {
            var t = this;
            t.isIPhone && e(".hide-on-ios").hide(),
                e("body").addClass("crt"),
                t.view.fadeIn(100, function () {
                    e.each(t.text, function (e, a) {
                        setTimeout(function () {
                            t.bios.append(a);
                        }, 700 * e);
                    });
                });
        },
        toggleAmbientSound: function (t) {
            t ? e(this.ambientAudio).animate({ volume: 0.2 }, 3e3) : e(this.ambientAudio).animate({ volume: 0 }, 8e3);
        },
        loadTrack: function (t) {
            var a = this;
            (a.loading.video = !1),
                (a.loading.audio = !1),
                a.setLoading(!0),
                e(a.audioPlayer).on("canplay", function () {
                    a.playTrack("audio");
                }),
                e("#video").on("canplay", function () {
                    a.playTrack("video");
                }),
                (a.playingTrack = t),
                t.addClass("active playing");
            var n = t.attr("data-sound"),
                i = t.attr("data-video"),
                o = t.attr("data-title"),
                s = t.attr("data-album");
            e("#video .mpeg").attr("src", "video/" + i + ".mp4"),
                e("#video .webm").attr("src", "video/" + i + ".webm"),
                e("#video").get(0).load(),
                (a.audioPlayer.src = "sound/" + n),
                a.audioPlayer.load(),
                "mediaSession" in navigator &&
                    (navigator.mediaSession.metadata = new MediaMetadata({
                        title: o,
                        artist: "Toasty Digital",
                        album: s,
                        artwork: [
                            { src: "img/cover/" + s + "_96x96.png", sizes: "96x96", type: "image/png" },
                            { src: "img/cover/" + s + "_128x128.png", sizes: "128x128", type: "image/png" },
                            { src: "img/cover/" + s + "_192x192.png", sizes: "192x192", type: "image/png" },
                            { src: "img/cover/" + s + "_256x256.png", sizes: "256x256", type: "image/png" },
                            { src: "img/cover/" + s + "_384x384.png", sizes: "384x384", type: "image/png" },
                            { src: "img/cover/" + s + "_512x512.png", sizes: "512x512", type: "image/png" },
                        ],
                    }));
        },
        playTrack: function (t) {
            var a = this;
            "audio" == t && (a.loading.audio = !0),
                "video" == t && (a.loading.video = !0),
                a.loading.audio && a.loading.video && (a.setLoading(!1), a.resumeTrack(), e("body").addClass("media-playing"), "mediaSession" in navigator && (navigator.mediaSession.playbackState = "playing"));
        },
        stopTrack: function () {
            var t = this;
            e(t.audioPlayer).unbind("canplay"),
                e("#video").unbind("canplay"),
                e("body").removeClass("media-playing"),
                e("#video").stop(!0, !0).fadeOut(800),
                setTimeout(function () {
                    e("#video").get(0).pause();
                }, 800),
                t.audioPlayer.pause(),
                t.playingTrack.removeClass("active playing"),
                "mediaSession" in navigator && (navigator.mediaSession.playbackState = "paused");
        },
        pauseTrack: function () {
            e("#video").get(0).pause(), this.audioPlayer.pause(), (navigator.mediaSession.playbackState = "paused");
        },
        resumeTrack: function () {
            e("#video").stop(!0, !0).fadeIn(800), e("#video").get(0).play(), (this.audioPlayerPromise = this.audioPlayer.play());
        },
    };
    t.init(),
        e(".login .hint a").on("click", function (t) {
            t.preventDefault(), e(this).parent(".hint").find("a").hide(), e(this).parent(".hint").find("span").show();
        }),
        e(".login form").on("submit", function (a) {
            a.preventDefault();
            var n = e(".login form input[type=password]").val().toLowerCase();
            [
                //base 64 , this just translates to pourzand
                "cG91cnphbmQ=",
                
            ].includes(btoa(n))
                ? (e(".login").removeClass("loaded"),
                  setTimeout(function () {
                      e(".login").hide(), t.toggleAmbientSound(!1), t.setLoading(!1);
                  }, 1800))
                : e(".login form input[type=password]").val("");
        }),
        e(".navbar .item.submenu button").on("click", function (t) {
            e(this).parent(".submenu").hasClass("active") ? e(".navbar .item.submenu.active").removeClass("active") : (e(".navbar .item.submenu.active").removeClass("active"), e(this).parent(".submenu").addClass("active"));
        }),
        e("body").on("click", function (t) {
            e(t.target).closest(".item.submenu.active").length <= 0 && e(".navbar .item.submenu.active").removeClass("active"),
                e(t.target).closest(".dialog, .navbar").length <= 0 && e(".dialog").css("display", "none").html(""),
                e(".file").removeClass("active");
        }),
        e(".disabled").on("click", function (e) {
            e.preventDefault();
        }),
        e("#about").on("click", function (t) {
            t.preventDefault(), e(".navbar .item.submenu.active").removeClass("active");
            e(".dialog")
                .html(
                    '<div><p>Mixtapes by <a href="https://twitter.com/jonsantoast" target="_blank">toasty digital</a><br />Website by <a href="https://twitter.com/starfennec" target="_blank">starfennec</a><br />Funny dancing lizard by <a href="https://twitter.com/ka92/" target="_blank">ka92</a></p></div>'
                )
                .css("display", "flex");
        }),
        e("#battery").on("click", function (t) {
            t.preventDefault(), e(".navbar .item.submenu.active").removeClass("active");
            e(".dialog")
                .html(
                    "<div><p>Battery power courtesy of Tesla Petroleum. Tesla Petroleum is not liable for any burns, explosions, or airborne carcinogens caused by this battery pack. Battery pack is single use; Do not attempt to recycle.</p></div>"
                )
                .css("display", "flex");
        }),
        e("#fullscreen").on("click", function (t) {
            t.preventDefault(), e(".navbar .item.submenu.active").removeClass("active");
            var a = document.documentElement;
            e("body").hasClass("fullscreen")
                ? (document.exitFullscreen
                      ? document.exitFullscreen()
                      : document.mozCancelFullScreen
                      ? document.mozCancelFullScreen()
                      : document.webkitExitFullscreen
                      ? document.webkitExitFullscreen()
                      : document.msExitFullscreen && document.msExitFullscreen(),
                  e("body").removeClass("fullscreen"))
                : (a.requestFullscreen ? a.requestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.webkitRequestFullscreen ? a.webkitRequestFullscreen() : a.msRequestFullscreen && a.msRequestFullscreen(),
                  e("body").addClass("fullscreen"));
        }),
        e("#restart").on("click", function (e) {
            e.preventDefault(), location.reload();
        }),
        e("#print").on("click", function (t) {
            e(".navbar .item.submenu.active").removeClass("active"), t.preventDefault(), window.print();
        }),
        e("#switchfiles").on("click", function (t) {
            t.preventDefault(), e(".navbar .item.submenu.active").removeClass("active"), e(this).toggleClass("invert"), e("body").toggleClass("show-hidden-files");
        }),
        e("#folder1").on("click", function (t) {
            t.preventDefault(), e(".finder").removeClass("focus"), e(".finder.2k49").addClass("focus").show("slow"), e(this).addClass("active");
        }),
        e("#folder2").on("click", function (t) {
            t.preventDefault(), e(".finder").removeClass("focus"), e(".finder.gktfolder").addClass("focus").show("slow"), e(this).addClass("active");
        }),
        e("#folder3").on("click", function (t) {
            t.preventDefault(), e(".finder").removeClass("focus"), e(".finder.blondafolder").addClass("focus").show("slow"), e(this).addClass("active");
        }),
        e("#folder4").on("click", function (t) {
            t.preventDefault(),
                e(".finder").removeClass("focus"),
                e(this).addClass("active"),
                setTimeout(function () {
                    e(".dialog").html("<div><p>File corrupted!<br />Please download it again.</p></div>").css("display", "flex");
                }, 0),
                e(this).addClass("active");
        }),
        e("#lizard").on("click", function (t) {
            t.preventDefault(), e("#video2").get(0).play(), e(".finder.fdl").addClass("focus").show();
        }),
        e("#readme").on("click", function (t) {
            t.preventDefault(), t.stopPropagation(), e(".finder.readme").addClass("focus").show("slow");
        }),
        e("#earththt").on("click", function (t) {
            t.preventDefault(), t.stopPropagation(), e(".finder.earth").addClass("focus").show("slow");
        }),
        e(".finder .close").on("click", function (t) {
            t.preventDefault(), e(this).closest(".finder").hide();
        }),
        e(".play-track").on("click", function (a) {
            a.preventDefault();
            var n = e(this);
            n.hasClass("playing") ||
                (t.setLoading(!0),
                t.playingTrack
                    ? (t.stopTrack(),
                      setTimeout(function () {
                          t.loadTrack(n);
                      }, 800))
                    : t.loadTrack(n));
        }),
        e("#pause").on("click", function (a) {
            a.preventDefault(), t.audioPlayer.paused ? (e(this).removeClass("invert"), t.resumeTrack()) : (e(this).addClass("invert"), t.pauseTrack());
        }),
        e("#stop").on("click", function (a) {
            a.preventDefault(), e("body").removeClass("media-playing"), t.stopTrack();
        }),
        e(".finder").on("mousedown click", function (t) {
            e(".finder.focus").removeClass("focus"), e(this).addClass("focus");
        }),
        e(".finder").each(function (t, a) {
            !(function (t) {
                var a = 0,
                    n = 0,
                    i = 0,
                    o = 0;
                e(t).find(".header").get(0) ? ((e(t).find(".header").get(0).onmousedown = s), (e(t).find(".header").get(0).ontouchstart = s)) : ((t.onmousedown = s), (t.ontouchstart = s));
                function s(e) {
                    if (((e = e || window.event).cancelable, e.touches))
                        var t = e.touches[0].pageX,
                            a = e.touches[0].pageY;
                    else (t = e.clientX), (a = e.clientY);
                    (i = t), (o = a), (document.onmouseup = c), (document.ontouchend = c), (document.onmousemove = l), (document.ontouchmove = l);
                }
                function l(e) {
                    if (((e = e || window.event).cancelable && e.preventDefault(), e.touches))
                        var s = e.touches[0].pageX,
                            l = e.touches[0].pageY;
                    else (s = e.clientX), (l = e.clientY);
                    (a = i - s), (n = o - l), (i = s), (o = l);
                    var c = t.offsetTop - n >= 28 ? t.offsetTop - n : 28,
                        d = t.offsetLeft - a >= 0 ? t.offsetLeft - a : 0;
                    (t.style.top = c + "px"), (t.style.left = d + "px");
                }
                function c() {
                    (document.onmouseup = null), (document.ontouchend = null), (document.onmousemove = null), (document.ontouchmove = null);
                }
            })(a);
        });
})(jQuery);
