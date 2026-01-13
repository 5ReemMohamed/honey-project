document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded, initializing map...");
    
    if (!window.currentLang) window.currentLang = "en";

    const mapTranslations = {
        YE: { en: "Yemen", ar: "اليمن", fr: "Yémen", es: "Yemen" },
        JO: { en: "Jordan", ar: "الأردن", fr: "Jordanie", es: "Jordania" },
        SA: { en: "Saudi Arabia", ar: "المملكة العربية السعودية", fr: "Arabie Saoudite", es: "Arabia Saudita" },
        QA: { en: "Qatar", ar: "قطر", fr: "Qatar", es: "Catar" },
        OM: { en: "Oman", ar: "عُمان", fr: "Oman", es: "Omán" },
        AE: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة", fr: "Émirats Arabes Unis", es: "Emiratos Árabes Unidos" },
        US: { en: "United States", ar: "الولايات المتحدة الأمريكية", fr: "États-Unis", es: "Estados Unidos" },
        visit: { en: "Visit Website", ar: "زيارة الموقع", fr: "Visiter le site", es: "Visitar sitio web" }
    };

    const chartDiv = document.getElementById("chartdiv");
    
    if (!chartDiv) {
        console.error(" chartdiv element not found!");
        return;
    }
    
    console.log("Chart div found:", chartDiv.id, "Dimensions:", chartDiv.offsetWidth, "x", chartDiv.offsetHeight);
    
    let chartInitialized = false;
    let resizeTimeout;

    function createGlobeChart() {
        console.log("Creating globe chart...");
                if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
                if (window.root && !window.root.isDisposed()) {
            console.log("Disposing previous chart...");
            window.root.dispose();
            window.root = null;
        }

        try {
            const root = am5.Root.new("chartdiv");
            window.root = root;
            
            console.log("AM5 Root created");

            root.autoResize = true;
            
            root.width = chartDiv.clientWidth;
            root.height = chartDiv.clientHeight;
            
            console.log("Set root dimensions:", root.width, "x", root.height);

            root.setThemes([am5themes_Animated.new(root)]);
            
            console.log("Themes set");

            const chart = root.container.children.push(
                am5map.MapChart.new(root, {
                    panX: "rotateX",
                    panY: "rotateY",
                    projection: am5map.geoOrthographic(),
                    rotationX: -40,
                    rotationY: -20,
                    homeZoomLevel: 2.5, 
                    homeGeoPoint: { longitude: 45, latitude: 25 }
                })
            );
            const polygonSeries = chart.series.push(
                am5map.MapPolygonSeries.new(root, { 
                    geoJSON: am5geodata_worldLow 
                })
            );

            polygonSeries.mapPolygons.template.setAll({
                interactive: true,
                fill: am5.color(0xe0e0e0),
                stroke: am5.color(0xffffff),
                strokeWidth: 1
            });

            const countryColors = {
                YE: am5.color(0x8D6E63),
                JO: am5.color(0xA1887F),
                SA: am5.color(0xC9A24D),
                QA: am5.color(0x9C27B0),
                OM: am5.color(0xFF9800),
                AE: am5.color(0xD4AF37),
                US: am5.color(0x3F51B5)
            };

            polygonSeries.events.on("datavalidated", () => {
                console.log("Polygon series data validated");
                polygonSeries.mapPolygons.each(polygon => {
                    const id = polygon.dataItem.get("id");
                    if (countryColors[id]) {
                        polygon.set("fill", countryColors[id]);
                    }
                });
            });
            const pinSeries = chart.series.push(
                am5map.MapPointSeries.new(root, { 
                    latitudeField: "latitude", 
                    longitudeField: "longitude" 
                })
            );

            pinSeries.data.setAll([
                { code: "YE", latitude: 15.5527, longitude: 48.5164, instagram: "#", facebook: "#", website: "#" },
                { code: "JO", latitude: 30.5852, longitude: 36.2384, instagram: "#", facebook: "#", website: "#" },
                { code: "SA", latitude: 23.8859, longitude: 45.0792, instagram: "#", facebook: "#", website: "#" },
                { code: "QA", latitude: 25.3548, longitude: 51.1839, instagram: "#", facebook: "#", website: "#" },
                { code: "OM", latitude: 21.4735, longitude: 55.9754, instagram: "#", facebook: "#", website: "#" },
                { code: "AE", latitude: 23.4241, longitude: 53.8478, instagram: "#", facebook: "#", website: "#" },
                { code: "US", latitude: 37.0902, longitude: -95.7129, instagram: "#", facebook: "#", website: "#" }
            ]);

            console.log("Pin data set");

            pinSeries.bullets.push((root, series, dataItem) => {
                const code = dataItem.dataContext.code;
                const marker = am5.Picture.new(root, {
                    src: "../assets/marker-brown.svg",
                    width: 26,
                    height: 26,
                    centerX: am5.p50,
                    centerY: am5.p100,
                    cursorOverStyle: "pointer",
                    showTooltipOn: "click"
                });

                marker.adapters.add("tooltipHTML", () => {
                    const lang = window.currentLang || "en";
                    const isRTL = lang === "ar";

                    return `
                        <div class="map-popup" style="direction:${isRTL ? "rtl" : "ltr"}">
                            <h4>${mapTranslations[code] ? mapTranslations[code][lang] : code}</h4>
                            <div class="branch-social d-flex justify-content-center gap-2">
                                <a href="${dataItem.dataContext.instagram || '#'}" target="_blank">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="${dataItem.dataContext.facebook || '#'}" target="_blank">
                                    <i class="fab fa-facebook"></i>
                                </a>
                            </div>
                            <a href="${dataItem.dataContext.website || '#'}" target="_blank" class="branch-btn">
                                ${mapTranslations.visit[lang]}
                            </a>
                        </div>
                    `;
                });

                return am5.Bullet.new(root, { sprite: marker });
            });

            chart.appear(1000, 100);
            chartInitialized = true;
            console.log("Chart initialized successfully");
            
            resizeTimeout = setTimeout(() => {
                if (root && !root.isDisposed()) {
                    console.log("Forcing resize after chart appearance...");
                    root.resize();
                }
            }, 1500);
            
        } catch (error) {
            console.error("Error creating chart:", error);
        }
    }

    function initMap() {
        console.log("Initializing map...");
        
        if (typeof am5 === 'undefined' || typeof am5map === 'undefined') {
            console.error("AMCharts library not loaded!");
            setTimeout(initMap, 100);
            return;
        }
        
        if (chartDiv.offsetWidth === 0 || chartDiv.offsetHeight === 0) {
            console.log("Chart container has zero dimensions, waiting...");
                        setTimeout(() => {
                console.log("After wait - dimensions:", chartDiv.offsetWidth, "x", chartDiv.offsetHeight);
                createGlobeChart();
            }, 100);
        } else {
            setTimeout(() => {
                createGlobeChart();
            }, 50);
        }
    }

    window.addEventListener('load', function() {
        console.log("Window fully loaded, checking chart...");
        if (window.root && !window.root.isDisposed()) {
            setTimeout(() => {
                window.root.resize();
            }, 100);
        }
    });

    let resizeDebounce;
    window.addEventListener('resize', function() {
        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(() => {
            if (window.root && !window.root.isDisposed()) {
                console.log("Window resized, resizing chart...");
                window.root.resize();
            }
        }, 250);
    });

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            console.log("Page loaded from cache, resizing chart...");
            setTimeout(() => {
                if (window.root && !window.root.isDisposed()) {
                    window.root.resize();
                } else {
                    initMap();
                }
            }, 100);
        }
    });

    document.addEventListener("languageChanged", event => {
        if (event.detail && event.detail.lang) {
            window.currentLang = event.detail.lang;
            if (window.root && window.root.series && !window.root.isDisposed()) {
                window.root.series.each(series => {
                    if (series instanceof am5map.MapPointSeries) {
                        series.bullets.each(bullet => {
                            const sprite = bullet.get("sprite");
                            if (sprite) sprite.invalidateTooltip();
                        });
                    }
                });
            }
        }
    });

    window.changeMapLanguage = function (lang) {
        if (mapTranslations.YE[lang]) {
            window.currentLang = lang;
            const event = new CustomEvent("languageChanged", { detail: { lang } });
            document.dispatchEvent(event);
        } else {
            console.warn(`Language "${lang}" not supported. Available: en, ar, fr, es`);
        }
    };
    
    setTimeout(initMap, 100);
    
    window.addEventListener('beforeunload', function() {
        if (window.root && !window.root.isDisposed()) {
            window.root.dispose();
        }
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        if (resizeDebounce) {
            clearTimeout(resizeDebounce);
        }
    });
});