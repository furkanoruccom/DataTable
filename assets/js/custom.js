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
        "ajax": "/object.txt",
        "rowId": 'id',
        "columns": [
            {
                "className": 'dt-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            { "data": "name" },
            { "data": "position" },
            { "data": "office" },
            { "data": "start_date" },
        ],
        "order": [[1, 'asc']],
        language: {
            "emptyTable": "Tabloda herhangi bir veri mevcut değil",
            "info": "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
            "infoEmpty": "Kayıt yok",
            "infoFiltered": "(_MAX_ kayıt içerisinden bulunan)",
            "infoThousands": ".",
            "lengthMenu": "_MENU_",
            "loadingRecords": "Yükleniyor...",
            "processing": "İşleniyor...",
            "search": "",
            "zeroRecords": "Eşleşen kayıt bulunamadı",
            "paginate": {
                "first": "İlk",
                "last": "Son",
                "next": "<i class='fas fa-chevron-right'>>",
                "previous": "<i class='fas fa-chevron-left'><"
            },
            "aria": {
                "sortAscending": ": artan sütun sıralamasını aktifleştir",
                "sortDescending": ": azalan sütun sıralamasını aktifleştir"
            },
            "select": {
                "rows": {
                    "_": "%d kayıt seçildi",
                    "1": "1 kayıt seçildi"
                },
                "cells": {
                    "1": "1 hücre seçildi",
                    "_": "%d hücre seçildi"
                },
                "columns": {
                    "1": "1 sütun seçildi",
                    "_": "%d sütun seçildi"
                }
            }
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