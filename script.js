//api endpoint
const BASE_URL = "https://tastedive.com/api/similar?"

//callback to api
function getData(type, searchTerm, callback) {
    $.ajax({
        dataType: "jsonp",
        url: BASE_URL,
        data: {
            q: searchTerm,
            info: 1,
            limit: 12,
            k: '336352-BookReco-7H8XASER',
            type: type
        },
        success: callback
    });
};
//watches for start button, media type, and query. displays error if invalid query
function watchSubmit(){
    $('#js-start').submit(event => {
        event.preventDefault();

        const queryTarget = $(event.currentTarget).find('.js-search-term');
        const queryVal = queryTarget.val();

        const typeTarget = $('button[type="submit"]');
        const typeVal = "book:";
if (queryVal == "" || queryVal == " " ) {
            $('.js-warn').html(`Please enter a valid query`);
        } else {
            getData(typeVal, queryVal, function (data) {
                if (data.Similar.Results.length > 0) {
                    $('.js-results').html("");
                    for (var i in data.Similar.Results) {
                        $('js-results').append(data.Similar.Results[i].Name);
                        output = getResultMarkup(data.Similar.Results[i]);
                        $('.js-results').append(output);
                        $('.js-warn').html("");
                    }
                } 
            });
        }

    });
    }

function getResultMarkup(data) {
    let output =
        `
    <div class="contain">
        <p class="js-name clearfix">${data.Name}</p>
        <div class="js-info">
            <span class="readmore-contain">${data.wTeaser}</span>
        </div>
    </div>
    `;

    return output;
}
    

$(document).ready(function () {
    watchSubmit();

});