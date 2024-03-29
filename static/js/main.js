var dn = {
    'a': 0.246477863, 'b': 1.049680975, 'c': 2.657768081, 'd': 5.795000451,
    'e': 13.18391648, 'f': 49.41444573, 'g': -57.65018668, 'h': -21.09426636,
    'i': -13.03875102, 'j': -8.859226936, 'k': -5.773245361, 'l': -2.957734356,
    'm': -1.59E-15, 'n': 3.450690082, 'o': 7.87260731, 'p': 14.1747631,
    'q': 24.62875192, 'r': 47.46209932, 's': 156.4790781, 't': -164.7148191, 'u': -55.37244921,
    'v': -31.87250248, 'w': -20.37622195, 'x': -12.5961717, 'y': -6.161946576, 'z': -6.37E-15
}

var userInputColor = null
var currentChart = null
var selectedStyle = null
var ind = 0;
var Chart__;
var numbers = []
var labels_ = []
var word___ = []
var words;
var fill = false;
var defaultFC = 3;
var stop = false
var updateTimer;
let fileText = null;

function choose(id) {
    numbers = []
    labels_ = []
    word___ = []
    ind = 0
    var userTxt = $("#userInput").val();
    $("#chart_text").text("")
    if (id === "fractal") {
        words = userTxt.split(' ');
        for (var i = 0; i < words.length; i++) {
            var li = []
            var lbl = []

            for (var j = 0; j < defaultFC; j++) {
                for (var n = 0; n < words[i].length; n++) {
                    var word = words[i][n].toLowerCase();
                    if (dn.hasOwnProperty(word)) {
                        li.push(dn[word]);
                        lbl.push("");
                    }
                }
            }
            word___.push(words[i])
            numbers.push(li);
            labels_.push(lbl);
        }
        if (words.length <= 1) {
            numbers.push([]);
            labels_.push([]);
        }
    } else {
        for (var i = 0; i < userTxt.length; i++) {
            var word = userTxt[i].toLowerCase();
            if (dn.hasOwnProperty(word)) {
                numbers.push(dn[word]);
                labels_.push('');
            }
        }
        word___.push(userTxt)
    }


    if (userTxt.length > 0) {
        $("#Chart").remove()
        $("#chart-container").append('<canvas  id="Chart"></canvas>')
        if (typeof selectedStyle === "undefined" || selectedStyle === null) {
            currentChart = id
            if (id === "spiro") {
                spiroFractal()
            } else {
                chartFunc(id, labels_, numbers, userInputColor)
            }

        } else {
            if (selectedStyle === "neon") {
                currentChart = id
                neon(id, labels_, numbers, userInputColor)
            } else {
                currentChart = id
                effects(id, labels_, numbers, selectedStyle)
            }
        }
    }
}

function getRandomRGBColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b}, 1)`;
}

function setColorByUser(type) {
    if (type === 'shuffle') {
        userInputColor = null
    } else {
        var color = $("#choose_color").val()
        userInputColor = color
    }
    if (currentChart !== null) {
        choose(currentChart)
    }
}

function setStyle(style) {
    if (style === 'default') {
        selectedStyle = null
    } else {
        selectedStyle = style
    }

    if (currentChart !== null) {
        choose(currentChart)
    }
}

function setFC() {
    stop = true
    var fc = $("#inputFC").val();
    $("#FC").text(fc);

    $("#Chart").remove()
    defaultFC = (fc - 1) + 1
    $("#chart-container").append('<canvas  id="Chart"></canvas>')
    if (currentChart !== null) {
        Chart__.destroy()
        Chart__ = 0
        ind = 0
        choose(currentChart)
    }
}

function saveCanvas() {
    // Get the canvas element
    const canvas = document.getElementById('Chart');

    // Create a new canvas element with white background
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const context = newCanvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw the original canvas image on the new canvas
    context.drawImage(canvas, 0, 0);

    // Create an image element
    const image = new Image();

    // Set the source of the image to the new canvas data URL
    image.src = newCanvas.toDataURL();

    // Create a link element
    const link = document.createElement('a');

    // Set the href of the link to the image data URL
    link.href = image.src;

    // Set the download attribute to specify the file name
    link.download = 'canvas_image.png';

    // Simulate a click on the link element to trigger the download
    link.click();
}


function openFile() {
    var fileInput = $('#upload-file');
    const file = event.target.files[0];

    var fileReader = new FileReader();
    fileReader.onload = function (e) {
        var arrayBuffer = e.target.result;

        var options = {};
        options.arrayBuffer = arrayBuffer;

        mammoth.extractRawText(options)
            .then(function (result) {
                var text = result.value;
                $("#userInput").text(text);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    fileReader.readAsArrayBuffer(file);
    fileInput.val(null)
    fileInput.on('change', openFile);
}

function un_fillFractall(id,tf){
    fill = tf;
    choose(id)
}


// ------------------------------ /  Style  \ ------------------------------ \\
function effects(type, labels_, numberList, selectedStyle) {
    var backgroundColors = [];
    for (var i = 0; i < numberList.length + 3; i++) {
        backgroundColors.push(getRandomRGBColor());
    }
    var colorId = -1

    function colorFromRaw(ctx) {
        const colors = backgroundColors;
        colorId += 1
        return colors[colorId];

    }

    if (type === "line") {
        neon(type, labels_, numberList, userInputColor)
    } else if (type === "radar" || type === "area" || type === "fractal") {
        const img = new Image();
        var n = (selectedStyle === "neon2") ? Math.floor(Math.random() * 13) : Math.floor(Math.random() * 121);
        img.src = 'static/img/effect/' + selectedStyle + '/' + n + '.png';

        img.onload = () => {
            const canvas = document.getElementById("Chart");
            const ctx = canvas.getContext("2d");
            const fillPattern = ctx.createPattern(img, 'repeat');
            var data = {
                labels: (type === "fractal") ? labels_[ind] : labels_,
                datasets: [{
                    data: (type === "fractal") ? numberList[ind] : numberList,
                    backgroundColor: fillPattern,
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointLabelFontSize: 0,
                    pointHitRadius: 0,
                }]
            }
            if (type === "area") {
                data.datasets[0].fill = true;
            }
            if (selectedStyle === "neon2") {
                data.datasets[0].borderColor = (type === "pie") ? backgroundColors : (ctx) => colorFromRaw(ctx)
                data.datasets[0].borderWidth = 3
            }
            const chart = new Chart(ctx, {
                type: (type === "area") ? "line" : (type === "fractal") ? "radar" : type,
                data: data,
                options: {
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                color: "rgba(0,0,0,0)"
                            }
                        },
                        title: {
                            display: false
                        }
                    }
                }
            });
        };
    } else {
        var numbers = numberList
        if (type === "treemap") {
            numbers = numberList.filter(function (number) {
                return number >= 0;
            });
        }

        const images = [];
        const loadPromises = [];

        var numbersItemCount = (type === "radar") ? 1 : numbers.length
        for (var i = 0; i < numbersItemCount; i++) {
            var n = (selectedStyle === "neon2") ? Math.floor(Math.random() * 13) : Math.floor(Math.random() * 121);
            var img = new Image();
            img.src = 'static/img/effect/' + selectedStyle + '/' + n + '.png';
            images.push(img);

            var loadPromise = new Promise(function (resolve) {
                img.onload = resolve;
            });

            loadPromises.push(loadPromise);
        }

        Promise.all(loadPromises).then(function () {
            const canvas = document.getElementById("Chart");
            const ctx = canvas.getContext("2d");

            const fillPattern = (index) => {
                return ctx.createPattern(images[index], 'repeat');
            };

            var data = {
                labels: labels_,
                datasets: [{
                    data: numbers,
                    backgroundColor: (context) => fillPattern(context.dataIndex),
                    borderWidth: 1,
                }]
            }
            if (type !== "radar") {
                data.datasets[0].fill = true;
            }
            if (selectedStyle === "neon2") {
                data.datasets[0].borderColor = (type === "pie") ? backgroundColors : (ctx) => colorFromRaw(ctx)
                data.datasets[0].borderWidth = 3
            }
            const chart = new Chart(ctx, {
                type: (type === "area") ? "line" : type,
                data: data,
                options: {
                    plugins: {
                        legend: {
                            display: false // غیرفعال کردن نمایش عنوان
                        },
                    },
                }
            });
        });
    }
}

function neon(type, labels_, numberList) {
    var numbers = numberList
    if (type === "treemap") {
        numbers = numberList.filter(function (number) {
            return number >= 0;
        });
    }

    var backgroundColors = [];
    for (var i = 0; i < numbers.length + 3; i++) {
        backgroundColors.push(getRandomRGBColor());
    }
    var colorId = -1

    function colorFromRaw(ctx) {
        const colors = backgroundColors;
        colorId += 1
        return colors[colorId];

    }

    var data = {
        labels: (type === "fractal") ? labels_[ind] : labels_,
        datasets: [{
            data: (type === "fractal") ? numbers[ind] : numbers,
            backgroundColor: 'rgb(0,0,0)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            pointLabelFontSize: 0,
            pointHitRadius: 0,
            borderRadius: 2,
            borderColor: (type === "pie") ? backgroundColors : (ctx) => colorFromRaw(ctx),
            padding: 0,
        }]
    };

    if (type === "area") {
        data.datasets[0].fill = true;
    }

    var treemapChart = $("#Chart").get(0).getContext("2d")
    Chart.defaults.borderColor = "rgba(0,0,0,0)";
    Chart.defaults.color = "rgba(0,0,0,0)";
    var newChart = new Chart(treemapChart, {
        type: (type === "area") ? "line" : (type === "fractal") ? "radar" : type,
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false // غیرفعال کردن نمایش عنوان
                },
            },

        }
    });
}

// ------------------------------ /  Charts  \ ------------------------------ \\

function chartFunc(type, labels_, numberList, color) {
    var numbers = numberList
    if (type === "treemap") {
        numbers = numberList.filter(function (number) {
            return number >= 0;
        });
        numbers.push([])
    } else if (type === "area") {
        numbers = numberList.reverse();
    }

    var backgroundColors = [];
    for (var i = 0; i < numbers.length; i++) {
        if (numbers.length > 1) {
            for (var _ = 0; _ < numbers[i].length + 10; _++) {
                backgroundColors.push(getRandomRGBColor());
            }
        }
        backgroundColors.push(getRandomRGBColor());
    }

    var colorId = -1

    function colorFromRaw(ctx) {
        const colors = backgroundColors;
        colorId += 1
        return colors[colorId];

    }

    var data = {
        labels: (type === "fractal") ? labels_[ind] : labels_,
        datasets: [{
            data: (type === "fractal") ? numbers[ind] : numbers,
            backgroundColor: (typeof color !== "undefined" && color !== null) ? color : (type === "pie") ? backgroundColors : (ctx) => colorFromRaw(ctx),
            borderWidth: (type === "line") ? 4 : 1,
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            pointLabelFontSize: 0,
            pointHitRadius: 0,
        }]
    };

    if (type === "line") {
        data.datasets[0].borderColor = (typeof color !== "undefined" && color !== null) ? color : backgroundColors;
    }

    if (type === "fractal" && fill == false) {
        data.datasets[0].borderColor = (typeof color !== "undefined" && color !== null) ? color : (type === "pie") ? backgroundColors : (ctx) => colorFromRaw(ctx),
        data.datasets[0].fill = false;
    }

    if (type === "area") {
        data.datasets[0].fill = true;
    }

    var radarChart = $('#Chart').get(0).getContext("2d");
    Chart.defaults.borderColor = "rgba(0,0,0,0)";
    Chart.defaults.color = "rgba(0,0,0,0)";
    radarChart.canvas.style.backgroundColor = 'white';
    Chart__ = new Chart(radarChart, {
        responsive: false,
        type: (type === "area") ? "line" : (type === "fractal") ? "radar" : type,
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: "rgba(0,0,0,0)"
                    }
                },
                title: {
                    display: false
                },

            }
        }
    });
    if (type === "fractal" && words.length > 1) {
        $("#chart_text").text(word___[ind])
        stop = false
        if (updateTimer) {
            clearTimeout(updateTimer)
        }
        updateTimer = setTimeout(updateChart, 2000);
    }
}

function updateChart() {

    ind += 1
    // تغییر مقادیر نمودار
    Chart__.data.labels = labels_[ind];
    Chart__.data.datasets[0].data = numbers[ind];
    $("#chart_text").text(word___[ind])

    // به‌روز‌رسانی نمودار
    Chart__.update();
    if (words.length > ind + 1 && stop === false) {
        updateTimer = setTimeout(updateChart, 2000);
    } else {
        ind = -1
        updateTimer = setTimeout(updateChart, 2000);
    }
}


function spiroFractal() {
    var FC = defaultFC;
    var color = getRandomRGBColor()
    if (userInputColor){
        color = userInputColor
    }
    var numberList = []
    var labels_ = []
    var words;
    var userTxt = $("#userInput").val();
    var words = userTxt.split(' ');
    for (var i = 0; i < words.length; i++) {
        var _ = []
        for (var n = 0; n < words[i].length; n++) {
            var word = words[i][n].toLowerCase();
            if (dn.hasOwnProperty(word)) {
                _.push(dn[word]);
            }
        }
        numberList.push(_)
    }
    var mx = 0
    for (var i = 0; i < numberList.length; i++) {
        if (mx < numberList[i].length) {
            mx = numberList[i].length
        }
    }
    var _q_ = 0
    copyNumberList = []
    for (var i = 0; i < numberList.length; i++) {
        ____ = numberList[i].length
        copyNumberList.push([])
        for (var n = 0; FC >= copyNumberList[i].length; n++) {
            var ____n____ = []
            for (var j = 0; j < n; j++) {
                ____n____.push(undefined);
            }
            for (var m = 0; m < ____; m++) {
                ____n____.push(numberList[i][m]);
            }
            copyNumberList[i].push(____n____)
        }
    }


    for (var i = 0; i < copyNumberList.length; i++) {
        if (mx < copyNumberList[i].length) {
            mx = copyNumberList[i].length
        }
    }
    for (var i = 0; i < FC; i++) {
        labels_.push(i)
    }

    var data = {
        labels: labels_,
        datasets: []
    };
    for (var i = 0; i < copyNumberList.length; i++) {
        for (var j = 0; j < copyNumberList[i].length; j++) {
            data.datasets.push({
                data: copyNumberList[i][j],
                backgroundColor: color,
                borderWidth: 1,
                borderColor: color,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointLabelFontSize: 0,
                pointHitRadius: 0,
                fill: false
            })
        }
    }

    var radarChart = $("#Chart").get(0).getContext("2d");
    Chart.defaults.borderColor = "rgba(0,0,0,0)";
    Chart.defaults.color = "rgba(0,0,0,0)";
    Chart__ = new Chart(radarChart, {
        responsive: false,
        type: 'radar',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: "rgba(0,0,0,0)"
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
}

// function funnel(labels_, numberList, color) {
//     // const img = new Image();
//     // var n = Math.floor(Math.random() * 121);
//     // img.src = 'static/img/effect/wall/' + n + '.png';
//     // img.onload = () => {
//     //     const canvas = document.getElementById("Chart");
//     //     const ctx = canvas.getContext("2d");
//     //     const fillPattern = ctx.createPattern(img, 'repeat');
//     //     const chart = new Chart(ctx, {
//     //         type: 'line',
//     //         data: {
//     //             labels: labels_,
//     //             datasets: [{
//     //                 data: numberList,
//     //                 backgroundColor: fillPattern,
//     //                 fill: true,
//     //                 borderWidth: 1,
//     //             }]
//     //         }
//     //     });

//     var numbers = numberList.filter(function (number) {
//         return number >= 0;
//     });
//     // var numbers = numberList

//     const images = [];
//     const loadPromises = [];

//     for (var i = 0; i < numbers.length; i++) {
//         var n = Math.floor(Math.random() * 121);
//         var img = new Image();
//         img.src = 'static/img/effect/texturizer/' + n + '.png';
//         images.push(img);

//         var loadPromise = new Promise(function (resolve) {
//             img.onload = resolve;
//             img.onerror = resolve;
//         });

//         loadPromises.push(loadPromise);
//     }

//     Promise.all(loadPromises).then(function () {
//         const canvas = document.getElementById("Chart");
//         const ctx = canvas.getContext("2d");

//         const fillPattern = (index) => {
//             return ctx.createPattern(images[index], 'repeat');
//         };

//         const chart = new Chart(ctx, {
//             type: "treemap",
//             data: {
//                 labels: labels_,
//                 datasets: [{
//                     data: numbers,
//                     backgroundColor: (context) => fillPattern(context.dataIndex),
//                     fill: true,
//                     borderWidth: 1,
//                 }]
//             },
//             options: {
//                 plugins: {
//                     legend: {
//                         display: false // غیرفعال کردن نمایش عنوان
//                     },
//                 },
//             }
//         });
//     });
// };

// switch (id) {
//     case 'radar':
//         currentChart = id
//         radar(labels_, wordList, userInputColor)
//         break
//     case 'line':
//         currentChart = id
//         line(labels_, wordList, userInputColor)
//         break
//     case 'area':
//         currentChart = id
//         area(labels_, wordList, userInputColor)
//         break
//     case 'treemap':
//         currentChart = id
//         treemap(labels_, wordList, userInputColor)
//         break
//     case 'funnel':
//         currentChart = id
//         funnel(labels_, wordList, userInputColor)
//         break
//     case 'pie':
//         currentChart = id
//         pie(labels_, wordList, userInputColor)
//         break
// }

// ---------------------------------

// function radar(labels_, numberList, color) {
//     if (color === null) {
//         color = getRandomRGBColor()
//     }
//     var data = {
//         labels: labels_,
//         datasets: [{
//             data: numberList,
//             backgroundColor: color,
//             borderWidth: 1,
//             pointBackgroundColor: 'rgba(0, 0, 0, 0)',
//             pointBorderColor: 'rgba(0, 0, 0, 0)',
//             pointLabelFontSize: 0,
//             pointHitRadius: 0,
//         }]
//     };

//     var radarChart = $("#Chart").get(0).getContext("2d");
//     Chart.defaults.borderColor = "rgba(0,0,0,0)";
//     Chart.defaults.color = "rgba(0,0,0,0)";
//     var newChart = new Chart(radarChart, {
//         responsive: false,
//         type: 'radar',
//         data: data,
//         options: {
//             plugins: {
//                 legend: {
//                     display: false,
//                     labels: {
//                         color: "rgba(0,0,0,0)"
//                     }
//                 },
//                 title: {
//                     display: false
//                 }
//             }
//         }
//     });
// }
//
// function line(labels_, numberList, color) {
//     if (color === null) {
//         color = getRandomRGBColor()
//     }
//     var data = {
//         labels: labels_,
//         datasets: [{
//             data: numberList,
//             borderColor: color,
//             borderWidth: 5,
//             pointBackgroundColor: 'rgba(0, 0, 0, 0)',
//             pointBorderColor: 'rgba(0, 0, 0, 0)',
//             pointLabelFontSize: 0,
//             pointHitRadius: 0
//
//         }]
//     };
//
//     var lineChart = $("#Chart").get(0).getContext("2d");
//     Chart.defaults.borderColor = "rgba(0,0,0,0)";
//     Chart.defaults.color = "rgba(0,0,0,0)";
//     var newChart = new Chart(lineChart, {
//         responsive: false,
//         type: 'line',
//         data: data,
//         options: {
//             plugins: {
//                 legend: {
//                     display: false,
//                     labels: {
//                         color: "rgba(0,0,0,0)"
//                     }
//                 },
//                 title: {
//                     display: false
//                 }
//             }
//         }
//     });
// }
//
// function area(labels_, numberList, color) {
//     if (color === null) {
//         color = getRandomRGBColor()
//     }
//     var numbers = numberList.reverse();
//     var data = {
//         labels: labels_,
//         datasets: [{
//             data: numbers,
//             backgroundColor: color,
//             borderColor: color,
//             borderWidth: 0,
//             pointBackgroundColor: 'rgba(0, 0, 0, 0)',
//             pointBorderColor: 'rgba(0, 0, 0, 0)',
//             pointLabelFontSize: 0,
//             pointHitRadius: 0,
//             fill: true,
//         }]
//     };
//
//     var lineChart = $("#Chart").get(0).getContext("2d");
//     Chart.defaults.borderColor = "rgba(0,0,0,0)";
//     Chart.defaults.color = "rgba(0,0,0,0)";
//     var newChart = new Chart(lineChart, {
//         responsive: false,
//         type: 'line',
//         data: data,
//         options: {
//             plugins: {
//                 legend: {
//                     display: false,
//                     labels: {
//                         color: "rgba(0,0,0,0)"
//                     }
//                 },
//                 title: {
//                     display: false
//                 }
//             }
//         }
//     });
// }
//
// function treemap(labels_, numberList, color) {
//     var numbers = numberList.filter(function (number) {
//         return number >= 0;
//     });
//
//     if (color !== null) {
//         var data = {
//             labels: labels_,
//             datasets: [{
//                 data: numbers,
//                 backgroundColor: color,
//                 borderWidth: 1,
//                 pointBackgroundColor: 'rgba(0, 0, 0, 0)',
//                 pointBorderColor: 'rgba(0, 0, 0, 0)',
//                 pointLabelFontSize: 0,
//                 pointHitRadius: 0,
//             }]
//         };
//     } else {
//         var backgroundColors = [];
//         for (var i = 0; i < numbers.length + 3; i++) {
//             backgroundColors.push(getRandomRGBColor());
//         }
//         var colorId = -1
//
//         function colorFromRaw(ctx) {
//             const colors = backgroundColors;
//             colorId += 1
//             return colors[colorId];
//
//         }
//
//         var data = {
//             labels: labels_,
//             datasets: [{
//                 data: numbers,
//                 backgroundColor: (ctx) => colorFromRaw(ctx),
//                 borderWidth: 1,
//                 pointBackgroundColor: 'rgba(0, 0, 0, 0)',
//                 pointBorderColor: 'rgba(0, 0, 0, 0)',
//                 pointLabelFontSize: 0,
//                 pointHitRadius: 0,
//                 borderRadius: 5,
//
//             }]
//         };
//     }
//
//
//     var treemapChart = $("#Chart").get(0).getContext("2d")
//     Chart.defaults.borderColor = "rgba(0,0,0,0)";
//     Chart.defaults.color = "rgba(0,0,0,0)";
//     var newChart = new Chart(treemapChart, {
//         type: 'treemap',
//         data: data,
//         options: {
//             plugins: {
//                 legend: {
//                     display: false // غیرفعال کردن نمایش عنوان
//                 },
//             },
//
//         }
//     });
// }
//
//
//
// }
//
// function pie(labels_, numberList, color) {
//     var backgroundColors = [];
//     for (var i = 0; i < numberList.length + 10; i++) {
//         backgroundColors.push(getRandomRGBColor());
//     }
//
//     if (color === null) {
//         color = backgroundColors
//     }
//     var data = {
//         labels: labels_,
//         datasets: [{
//             data: numberList,
//             backgroundColor: color,
//             borderWidth: 1,
//             pointBackgroundColor: 'rgba(0, 0, 0, 0)',
//             pointBorderColor: 'rgba(0, 0, 0, 0)',
//             pointLabelFontSize: 0,
//             pointHitRadius: 0
//
//         }]
//     };
//
//
//     var pieChart = $("#Chart").get(0).getContext("2d");
//     Chart.defaults.borderColor = "rgba(0,0,0,0)";
//     Chart.defaults.color = "rgba(0,0,0,0)";
//     var newChart = new Chart(pieChart, {
//         responsive: false,
//         type: 'pie',
//         data: data,
//         options: {
//             plugins: {
//                 legend: {
//                     display: false,
//                     labels: {
//                         color: "rgba(0,0,0,0)"
//                     }
//                 },
//                 title: {
//                     display: false
//                 }
//             }
//         }
//     });
// }
