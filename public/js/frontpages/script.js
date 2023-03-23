$(document).ready(()=>{
    $('#flexSwitchCheckChecked').on('click', ()=>{
        var x = $('.switch > div>:first-child');
        var y = $('.switch > div>:last-child');

        var Annually = $('.Year');
        var Monthly = $('.Month');
        if ($('#flexSwitchCheckChecked').is(':checked')){
            x.removeClass('active');
            y.addClass('active');
            Monthly.css('display', 'none')
            Annually.css('display', 'block')
        }
        else{
            y.removeClass('active');
            x.addClass('active');
            Annually.css('display', 'none')
            Monthly.css('display', 'block')
        }


    })
})