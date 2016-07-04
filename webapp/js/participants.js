$(document).ready(function() => {

    var form = $('form[participant]');

    form.submit(function(evt) {

        evt.preventDefault();

        var id = form.find('[name="_id"]').val();

        $.ajax({
            type: id ? 'PUT' : 'POST',
            url: form.attr("target"),
            data: form.serialize(),

            success: function() => {
                document.location.href = '/participants';
            }

        });

    });


});