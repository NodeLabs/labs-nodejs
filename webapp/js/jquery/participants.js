$(document).ready(() => {

    var form = $('form[participant]');

    form.submit((evt) => {

        evt.preventDefault();

        var id = form.find('[name="_id"]').val();

        $.ajax({
            type: id ? 'PUT' : 'POST',
            url: form.attr("action"),
            data: form.serialize(),

            success: () => {
                document.location.href = '/training';
            }

        });

        return false;
    });


});