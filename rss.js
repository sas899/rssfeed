var MIN_SEARCH_LENGTH = 3
var scripts = document.getElementsByTagName('script');
var index = scripts.length - 1;
var urlParam = new URLSearchParams(scripts[index].src.split('?')[1]);
var searchInput = document.createElement('input')
searchInput.type = 'search'
searchInput.setAttribute('id', 'akrss_search_input')
searchInput.setAttribute('name', 'akrss_search_input')
searchInput.placeholder = 'Search...'

var searchButton = document.createElement('button')
searchButton.type = 'button'
searchButton.classList.add('akrss-search-button')
searchButton.textContent = 'Filter'

let $queryString = '';

if ( urlParam.has('categories') ) {
    $queryString = '?categories=' + urlParam.get('categories')
}

if ( urlParam.has('search') ) {
    if ($queryString.length) {
        $queryString += '&s=' + urlParam.get('search')
    } else {
        $queryString = '?s=' + urlParam.get('search')
    }
}

var defaultImg = 'https://www.shareandstocks.com/wp-content/uploads/2020/11/stocks-trading.jpg';
if ( urlParam.has('image') ) {
    defaultImg = urlParam.get('image')
}

function timeSince(date) {
  var seconds = Math.floor(((new Date()).getTime() - date.getTime()) / 1000);
  console.log(seconds)
  console.log(new Date() - date)

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}

function fetchFeed(searchTerm = '') {

    let RSS_URL = `https://www.shareandstocks.com/categories-feed` + $queryString;

    if (searchTerm.length >= MIN_SEARCH_LENGTH) {
        if ($queryString.length) {
            RSS_URL += '&s=' + searchTerm
        } else {
            RSS_URL += '?s=' + searchTerm
        }
    }

    fetch(RSS_URL)
        .then(res => res.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(res => {
            let prevSearchValue = (searchInput && searchInput.value) ? searchInput.value : '';
    
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
                #akrss_search_input {
                    display: block;
                    width: 100%;
                    padding: 0.375rem 0.75rem;
                    font-size: 1rem;
                    font-weight: 400;
                    line-height: 1.5;
                    color: #212529;
                    background-color: #fff;
                    background-clip: padding-box;
                    border: 1px solid #ced4da;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    border-radius: 0.25rem;
                    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                }
                .akrss-search-placeholder {
                    display: flex;
                    gap: 10px;
                    ;margin-bottom: 20px;
                }
                
                .akrss-search-button {
                    background: #008ec1;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 15px 30px;
                    text-transform: uppercase;
                    font-weight: bold;
                    font-size: 14px;
                    cursor: pointer;
                }
                @media only screen and (max-width: 767px) {
                    .list-card h3 a, .list-card-title {
                        font-size: 15px;
                    }
                }
            </style>
            <div class="akrss-search-placeholder"></div>
            <div class="akrss-container">
            
            `;
    
            res.querySelectorAll("item").forEach( el => {
                html += `
                    <div class="list-card  akrss-card" style="border-radius: 5px; border: 1px solid rgb(230, 230, 230); background-color: rgb(255, 255, 255); margin-bottom: 10px; overflow: hidden;">
                        <div class="list-card-content ">
                            <div class="list-card-body" style="height: 100%; border-radius: 5px; display: flex; flex-direction: row;">
                                <div class="akrsscard-img" style="border-radius: 0px; min-width: 125px; width: 250px; max-width: 250px; flex: 1 1 0%;">
                                <a href="${el.querySelector('link').innerHTML}" target="_blank" rel="noopener noreferrer">
                                ${
                                    el.querySelector('image').innerHTML ?
                                    `<img referrerpolicy="no-referrer" src="${el.querySelector('image').innerHTML}">`
                                    :
                                    `<img referrerpolicy="no-referrer" src="${defaultImg}">`
                                }
                                </a>
                                </div>
                                <style>
                                    .akrsscard-img {
                                        width: 100%;
                                        overflow: hidden;
                                        background: #fff;
                                        display: flex;
                                        align-items: center;
                                    }
    
                                    .akrsscard-img img {
                                        display: block;
                                        width: 100%;
                                        height: 150px !important;
                                        object-fit: cover !important;
                                    }
                                </style>
                                <div class="list-card-summary" style="flex: 2 1 0%; display: flex; flex-direction: column;">
                                    <div class="akrsscard-footer" style="display: flex; align-items: center; font-size: 12px; line-height: 26.4px; color: rgb(116, 116, 116); height: 30px;"><span style="width: 5px;height: 5px;background: grey;border-radius: 50%;margin-right: 5px;"></span><span class="card-time" style="line-height: inherit; white-space: nowrap;">
                                    ${
                                        // timeSince(
                                        //   new Date(
                                        //     el.querySelector("pubDate").textContent.replace(' +0000', '')
                                        //   ))
                                         el.querySelector("pubDate").textContent
                                    }
                                    </span>
                                    </div>
                                    <div style="display: flex; flex-direction: column; flex: 2 1 0%;">
                                        <h3 class="list-card-title" style="line-height: 24px;"><a href="${el.querySelector('link').innerHTML}" target="_blank" rel="noopener noreferrer" style="color: rgb(18, 19, 20);line-height: 24px;">${el.querySelector('title').innerHTML}</a></h3>
                                        <div class="list-card-description" style="line-height: 20px; font-size: 14px; color: rgb(106, 106, 117); -webkit-line-clamp: 3;">${el.querySelector('description').innerHTML}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
            })
    
            document.body.querySelector("ss-rss-list").innerHTML = html;

            if ( ! urlParam.has('search') ) {
                document.querySelector('.akrss-search-placeholder').append(searchInput)
                document.querySelector('.akrss-search-placeholder').append(searchButton)
            }
        })

}

searchButton.addEventListener('click', (e) => {
    const searchTerm = searchInput.value.trim()
    if (searchTerm.length >= MIN_SEARCH_LENGTH) {
        fetchFeed(searchTerm)
    } else {
        fetchFeed()
    }
});

fetchFeed()
