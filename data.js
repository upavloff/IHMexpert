function dateToString(timestamp) {
    var date = new Date(timestamp);
    var sec = date.getSeconds();
    var min = date.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + ":" + sec;
}

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    const dataNewFormat = [];
    console.log(data);
    for (element of data) {
        //html display of the json
        /*
        const root = document.createElement('p');
        const initDate = document.createElement('div');
        const ipUser = document.createElement('div');
        const nbTrials = document.createElement('div');
        const formNameTimeline = document.createElement('div');
        const errors = document.createElement('div');
        const unlock = document.createElement('div');
        const nbClick = document.createElement('div');
        const listNbUnusefulClick = document.createElement('div');
        const listDuration = document.createElement('div');
        const totalDuration = document.createElement('div');

        const dateString = new Date(element.initDate).toLocaleString();
        initDate.textContent = dateString;
        ipUser.textContent = 'ipUser : ' + element.ipUser;
        nbTrials.textContent = `nbTrials : ${element.nbTrials}`;
        formNameTimeline.textContent = 'formNameTimeline : ' + element.formNameTimeline.toString();
        errors.textContent = 'errors : ' + element.errors.toString();
        unlock.textContent = 'unlock : ' + element.unlock.toString();
        nbClick.textContent = 'nbClick : ' + String(element.nbClick);
        listNbUnusefulClick.textContent = 'liste des clicks inutiles : ' + element.listNbUnusefulClick.toString();
        listDuration.textContent = ' durées succesives : [';
        for (date of element.listDuration) {
            timer = dateToString(date);
            listDuration.textContent += timer + ',';
        }
        listDuration.textContent += ']';
        totalDuration.textContent = "durée : " + dateToString(element.totalDuration);

        root.append(initDate, ipUser, nbTrials, formNameTimeline, errors, unlock, nbClick, listNbUnusefulClick, listDuration, totalDuration);
        document.body.append(root);  */

        //------------------------------------------------------
        //----  tranform data to json convertible to csv
        const jsonFormId = { 'Square': 0, 'Circle': 1, 'Triangle': 2, 'Cross': 3 };
        const elementSize = element.formNameTimeline.length;
        for (var i in element.formNameTimeline) {
            console.log('list lock element is :' + element.listLockState[i]);
            dataNewFormat.push({
                initDate: element.initDate,
                ipUser: element.ipUser,
                nbTrials: parseInt(i) + 1,
                nbTotalTrials: element.nbTrials,
                nbBlock: 1 + Math.trunc(parseInt(i) / parseInt(element.nbFormsByBlock)),
                nbTotalBlock: Math.trunc(elementSize / parseInt(element.nbFormsByBlock)),
                blockSize: element.nbFormsByBlock,
                form: element.formNameTimeline[i],
                formId: jsonFormId[element.formNameTimeline[i]],
                formFreq: element.blockFormFrequence[element.formNameTimeline[i]],
                nbFormToSelect: element.listNbFormToSelect[i],
                occurence: element.listOccurence[i],
                success: element.listNbUnusefulClick[i] > 0 ? 0 : 1,
                lockSettings: element.lockSettings,
                tryUnlock: element.listTryUnlock[i],
                unlockState: element.listLockState[i],
                timeToUnlock: element.listTimeToUnlock[i],
                sliderTimeBeforeDisappear: element.sliderTimeBeforeDisappear,
                transitionDuration: element.lockSettings * element.sliderTimeBeforeDisappear,
                firstUnlockOccurence: element.firstUnlockOccurence,
                firstUnlockTrial: element.firstUnlockTrial,
                lastUnlockOccurence: element.lastUnlockOccurence,
                lastUnlockTrial: element.lastUnlockTrial,
                nbClick: element.listNbClick[i],
                nbUnusefulClick: element.listNbUnusefulClick[i],
                duration: element.listDuration[i],
                nbLockOpened: element.listNbLockOpened[i],
                totalDuration: element.totalDuration
            });
        }
    }
    const headers = {
        //______________________________user info
        initDate: 'date',
        ipUser: 'user_ip',
        //______________________________trial info
        nbTrials: 'trial_id',
        nbTotalTrials: 'n_trials',
        nbBlock: 'block_id',
        nbTotalBlock: 'n_block',
        blockSize: 'block_size',
        form: 'target_shape',
        formId: 'target_id',
        formFreq: 'target_freq',
        nbFormToSelect: 'target_n',
        occurence: 'occurence',
        success: 'success',
        lockSettings: 'n_locks',
        tryUnlock: 'unlock_action',
        unlockState: 'lock_state',
        timeToUnlock: 'time_unlock',
        sliderTimeBeforeDisappear: 'lock_duration',
        transitionDuration: 'transition_duration',
        firstUnlockOccurence: 'first_unlock_occurence',
        firstUnlockTrial: 'first_unlock_trial',
        lastUnlockOccurence: 'last_unlock_occurence',
        lastUnlockTrial: 'last_unlock_trial',
        nbClick: 'nb_total_click',
        nbUnusefulClick: 'nb_unuseful_click',
        duration: 'time',
        //______________________________current state
        nbLockOpened: 'n_opened_locker',
        //______________________________all experience info
        totalDuration: 'exp_total_time'
    }
    return {
        headers: headers,
        data: dataNewFormat
    };
}
//-------------------------------------------------------------------
//                      export to csv part
//-------------------------------------------------------------------
function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }
    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
    });
    var downloadButton = document.getElementById("downloadButton");
    downloadButton.onclick = function() {
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveOrOpenBlob(blob, exportedFilenmae);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
    }
    return csv;
}

//console.log(data.value);
var fileTitle = 'IHMexpertDATA';

(async() => {
    const res = await getData();
    const headers = res.headers;
    const data = res.data;
    const csv = exportCSVFile(headers, data, fileTitle);
    var output = document.getElementById("output");
    csvToHtml(csv, output);
})()

//-------------------------------------------------------------
//                      display as CSV
//-------------------------------------------------------------

function convertToArray(sCSV, options) {
    var result = {
            headers: null,
            rows: null
        },
        firstRowAt = 0,
        tds,
        first,
        cols;
    options = options || {};
    options.seperator = ",";
    options.hasHeader = true;
    options.headerPrefix = "COL";

    // Create header
    tds = sCSV.split("\x0a");
    first = tds[0].split(options.seperator);
    if (options.hasHeader) {
        result.headers = first;
        result.headers = result.headers.map(function(header) {
            return header.replace(/\//g, "_");
        });
        firstRowAt = 1;
    } else {
        result.headers = first.map(function(header, i) {
            return options.headerPrefix + i;
        });
    }

    // Create rows
    cols = result.headers.length;
    result.rows = tds.map(function(row, i) {
        return row.split(options.seperator);
    });
    return result;
}

function tag(element, value) {
    return "<" + element + ">" + value + "</" + element + ">";
}

function toHTML(arr) {
    var sTable = "<table class=\"table table-striped\"><thead>";
    arr.map(function(row, i) {
        var sRow = "";
        row.map(function(cell, ii) {
            var tagname = (i === 0) ? "th" : "td";
            sRow += tag(tagname, cell);
        });

        sTable += tag("tr", sRow) + ((i === 0) ? "</thead><tbody>" : "");
    });
    return sTable + "</tbody></table>";
}

function csvToHtml(csv, output, options) {
    var sCSV = csv,
        result = convertToArray(sCSV, options || {});
    output.innerHTML = toHTML(result.rows);
}
// INCLUDE TO HERE - csvToHtml
/*
$source.on("change keyup touchend", function() {
    csvToHtml($source, $output);
});*/

// This is how you can use the code