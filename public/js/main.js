$(document).ready(function () {
    $('.delete-article').on('click', function (e) {
        $target = $(e.target);
        console.log('fuck')
        console.log($target.attr('data-id'));
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + id,
            success: function (response) {
                alert('Deleteing Article');
                window.location.href = "/";
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
});
