/* Formatting function for row details - modify as you need */
function format(d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;" class="table table-striped table-bordered mb-0">' +
        '<tr>' +
        '<td>Full name:</td>' +
        '<td>' + d.name + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Extension number:</td>' +
        '<td>' + d.extn + '</td>' +
        '</tr>' +
        '</table>';
}


$.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {
        var min = new Date($('#minDate').val());
        var max = new Date($('#maxDate').val());
        var startDate = new Date(data[4].split("/").reverse().join("-"));  // assuming data[4] format is "YYYY/MM/DD"

        if (isNaN(min) && isNaN(max)) {
            return true;
        }

        if (isNaN(min) && startDate <= max) {
            return true;
        }

        if(isNaN(max) && startDate >= min) {
            return true;
        }

        if (startDate <= max && startDate >= min) {
            return true;
        }

        return false;
    }
);

$(document).ready(function () {









    // Add event listener for opening and closing details
    $('#example').on('click', 'tbody td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
        }
    });

    $('#example').on('requestChild.dt', function (e, row) {
        row.child(format(row.data())).show();
    });

    var table = $('#example').DataTable({
        fixedHeader: true,
        "ajax": "object.json",
        "rowId": 'id',
        "columns": [
            {
                "className": 'dt-control',
                "orderable": false,
                "data": null,
                "defaultContent": '',
            },
            { "data": "name" },
            { "data": "position" },
            { "data": "office" },
            { "data": "start_date" },
        ],
        "order": [[1, 'asc']],
        "language": {
            "url": "languege.json"
        },
        "pageLength": 25,
        "drawCallback": function () {
            const columns = [

                { index: 1, style: { "background-color": "#212529" } },

            ];
            columns.forEach(col => {
                $(`#example tbody tr td:nth-child(${col.index})`)
                    .attr("data-title", col.title)
                    .css(col.style || {});
            });
        },
            
      
    });

    
    $('#btnFilter').click( function() {
        var min = new Date($('#minDate').val());
        var max = new Date($('#maxDate').val());
    
        if (min > max) {
            alert("Başlangıç tarihi bitiş tarihinden büyük olamaz!");
        } else {
            table.draw();
        }
    });


    $('.status-dropdown').change(function () {
        table.column(3).search($(this).val()).draw();
    });
    
  

    


    table.on('stateLoaded', (e, settings, data) => {
        for (var i = 0; i < data.childRows.length; i++) {
            var row = table.row(data.childRows[i]);
            row.child(format(row.data())).show();
        }
    })
});