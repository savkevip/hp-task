var data = {};
var results = {};

var button = document.getElementsByName('submitResult');
var messageContainer = document.getElementsByClassName('result-message');
var loader = document.getElementsByName('loader');

document.getElementsByName('playerInput')
    .forEach(function (input) {
        input.addEventListener('change', onChange);
    });

button
    .forEach(function (button) {
        button.addEventListener('click', onClick);
    });

loader
    .forEach(function (img) {
        img.style.display = "none";
    });

function disableButtons() {
    button
        .forEach(function (button) {
            button.setAttribute('disabled', 'true');
        });
}

function setIndex(player) {
    return player - 1;
}

//messages - start
function showSuccessMessage(player) {
    document.body.innerHTML = '<div class="success-message">' + 'Bingo! Winner is player ' + player + '!' + '</div>'
}

function showDefaultMessage(player, message) {
    var index = setIndex(player);
    messageContainer[index].innerHTML = '<div class="warning-message">' + 'Choose ' + message + ' number...' + '</div>';
}

function showErrorMessage(player, errorMessage) {
    var index = setIndex(player);
    messageContainer[index].innerHTML = '<div class="danger-message">' + errorMessage + '</div>';
}
//messages - end

//loader - start
function showLoader(player) {
    var index = setIndex(player);
    button[index].style.display = "none";
    loader[index].style.display = "block";
}

function hideLoader(player) {
    var index = setIndex(player);
    button[index].style.display = "block";
    loader[index].style.display = "none";
}
//loader - end

//actions - start
function onChange(e) {
    data[e.target.id] = e.target.value;
    e.preventDefault();
}

function onClick(e) {
    checkResult(data, e.target.id);
    showLoader(e.target.id);
    e.preventDefault();
}
//actions - end

//communication with api - start
function checkResult(data, player) {
    var promise = new Promise(
        function (resolve, reject) {
            const request = new XMLHttpRequest();

            request.open(
                'GET',
                'https://www.drukzo.nl.joao.hlop.nl/challenge.php?player=' + player + '&guess=' + data[player],
                true
            );
            request.onload = function () {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function() {
                reject(Error('Error fetching data.'));
            };

            request.send();
        }
    );

    promise
        .then(function (response) {
            hideLoader(player);

            var parsedResponse = JSON.parse(response);
            if (parsedResponse.guess) {
                results[player] = parsedResponse.guess;

                if (parsedResponse.guess === 'Bingo!!!') {
                    showSuccessMessage(player);
                    disableButtons();
                } else {
                    showDefaultMessage(player, parsedResponse.guess);
                }
            } else {
                showErrorMessage(player, parsedResponse.error)
            }
        })
        .catch(function (error) {
            hideLoader(player);
            console.log('Request is denied... reason is ' + error);
        });
}
//communication with api - end


