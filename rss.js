var scripts = document.getElementsByTagName('script');
var index = scripts.length - 1;
var urlParam = new URLSearchParams(scripts[index].src.split('?')[1]);

let $queryString = '';

if ( urlParam.has('categories') ) {
    $queryString = '?categories=' + urlParam.get('categories')
}

// function ddiff(date1, date2, interval) {
//     var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
//     date1 = new Date(date1);
//     date2 = new Date(date2);
//     var timediff = date2 - date1;
//     if (isNaN(timediff)) return NaN;
//     switch (interval) {
//         case "years": return date2.getFullYear() - date1.getFullYear();
//         case "months": return (
//             ( date2.getFullYear() * 12 + date2.getMonth() )
//             -
//             ( date1.getFullYear() * 12 + date1.getMonth() )
//         );
//         case "weeks"  : return Math.floor(timediff / week);
//         case "days"   : return Math.floor(timediff / day); 
//         case "hours"  : return Math.floor(timediff / hour); 
//         case "minutes": return Math.floor(timediff / minute);
//         case "seconds": return Math.floor(timediff / second);
//         default: return undefined;
//     }
// }

function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}

const RSS_URL = `https://www.shareandstocks.com/categories-feed` + $queryString;

fetch(RSS_URL)
    .then(res => res.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(res => {
        let html = `
        <style>
            .list-card {
                width: 100%;
                position: relative;
                max-width: 100%;
                z-index: 1;
            }
            .list-card .list-card-body {
                display: flex;
            }
            .list-card .list-card-video {
                width: 100%;
                max-width: 250px;
            }
                .list-card .list-card-video video {
                width: 100%;
                object-fit: cover;
            }
            .list-card .list-card-iframe {
                width: 100%;
                max-width: 250px;
            }
            .list-card .list-card-iframe > div {
                width: inherit !important;
                min-width: 250px;
                max-width: 250px;
            }
            .list-card .list-card-iframe > div iframe {
                width: inherit !important;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            .list-card .list-card-summary {
                text-align: left;
            }
            .list-card .list-card-summary .list-card-footer {
                display: flex;
                align-items: center;
                color: #0199ff;
                margin-top: 5px;
                display: flex;
                align-items: center;
                font-size: 12px;
            }
            .list-card .list-card-summary .list-card-footer .hostname {
                text-transform: uppercase;
            }
            .list-card .list-card-summary .list-card-footer .dot {
                color: #747474;
            }
            .list-card .list-card-summary .list-card-footer .card-time {
                color: #747474;
                font-size: 12px;
            }
            .list-card h3 {
                line-height: 22px;
                font-size: 18px;
                margin: 5px 0 10px;
                color: #121314;
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .list-card h3.twitter {
                -webkit-line-clamp: 5;
            }
            .list-card h3 a {
                text-decoration: none;
                color: #121314;
                line-height: 22px;
                font-size: 18px;
            }
            .list-card .list-card-imgbox {
                max-width: 250px;
                object-fit: cover;
            }
            .list-card img {
                width: 250px;
                object-fit: cover;
            }
            .list-card .list-card-content_small .list-card-imgbox {
                max-width: 160px;
            }
            .list-card .list-card-content_small img {
                width: 160px;
            }
            .list-card .list-card-content_small .list-card-iframe {
                width: 160px;
            }
            .list-card .list-card-content_tiny .list-card-imgbox {
                max-width: 125px;
            }
            .list-card .list-card-content_tiny img {
                width: 125px;
            }
            .list-card .list-card-content_tiny .list-card-iframe {
                width: 125px;
            }
            .list-card .list-card-summary {
                padding: 5px 16px;
                overflow: hidden;
            }
            .list-card .list-card-description {
                font-size: 14px;
                color: #6a6a75;
                overflow: hidden;
                line-height: 20px;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }
            .list-card .list-card-content_tiny h3 {
                -webkit-line-clamp: 5;
            }
            .list-card .list-card-content_tiny .list-card-description {
                display: none;
            }
            .list-card .list-card-content {
                width: 100%;
                height: 100%;
            }
            .list-card .list-card-title a:hover {
                color: #666;
                text-decoration: unset;
            }
            .list-card.list-card_border {
                border: 1px solid #e6e6e6;
                border-radius: 5px;
            }
            .list-card.list-card_border .list-card-video {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            .list-card.list-card_border .list-card-iframe {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            .list-card_edge .list-ard-imgbox {
                max-width: 250px;
                width: unset;
            }
            .list-card_edge .list-ard-imgbox img {
                max-width: 250px;
                width: 250px;
                min-width: 250px;
            }
            .list-card_edge .list-card-content_small .list-card-imgbox {
                max-width: 160px;
            }
            .list-card_edge .list-card-content_small img {
                max-width: 160px;
                width: 160px;
                min-width: 160px;
            }
            .list-card_edge .list-card-content_tiny .list-card-imgbox {
                max-width: 125px;
            }
            .list-card_edge .list-card-content_tiny img {
                max-width: 125px;
                width: 125px;
                min-width: 125px;
            }
        </style>
        <div class="akrss-container">`;

        res.querySelectorAll("item").forEach( el => {
            console.log(el.querySelector('pubDate').textContent);
            html += `
                <div class="list-card  akrss-card" style="height: 155px; border-radius: 5px; border: 1px solid rgb(230, 230, 230); background-color: rgb(255, 255, 255); margin-bottom: 10px; overflow: hidden;">
                    <div class="list-card-content ">
                        <div class="list-card-body" style="height: 100%; border-radius: 5px; display: flex; flex-direction: row;">
                            <div class="akrsscard-img" style="border-radius: 0px; min-width: 125px; width: 250px; max-width: 250px; flex: 1 1 0%;">
                            ${
                                el.querySelector('image').innerHTML ?
                                `<a href="${el.querySelector('link').innerHTML}" target="_blank" rel="noopener noreferrer">
                                    <img referrerpolicy="no-referrer" src="${el.querySelector('image').innerHTML}">
                                </a>`
                                :
                                ''
                            }
                            </div>
                            <style>
                                .akrsscard-img {
                                    width: 100%;
                                    overflow: hidden;
                                    background: #dddddd;
                                }

                                .akrsscard-img img {
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                }
                            </style>
                            <div class="list-card-summary" style="flex: 2 1 0%; display: flex; flex-direction: column;">
                                <div class="akrsscard-footer" style="display: flex; align-items: center; font-size: 12px; line-height: 26.4px; color: rgb(116, 116, 116); height: 30px;"><span style="margin: 0px 9px; color: rgb(116, 116, 116); font-size: 8px;">●</span><span class="card-time" style="line-height: inherit; white-space: nowrap;">${datediff(new Date(el.querySelector('pubDate').textContent), new Date(), 'days')} days</span>
                                </div>
                                <div style="display: flex; flex-direction: column; flex: 2 1 0%;">
                                    <h3 class="list-card-title" style="line-height: 24px; font-size: 18px; -webkit-line-clamp: 2;"><a href="${el.querySelector('link').innerHTML}" target="_blank" rel="noopener noreferrer" style="color: rgb(18, 19, 20); font-size: 18px; line-height: 24px; -webkit-line-clamp: 2;">${el.querySelector('title').innerHTML}</a></h3>
                                    <div class="list-card-description" style="line-height: 20px; font-size: 14px; color: rgb(106, 106, 117); -webkit-line-clamp: 3;">${el.querySelector('description').innerHTML}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        })

        document.body.querySelector("ss-rss-list").innerHTML = html;
    })
