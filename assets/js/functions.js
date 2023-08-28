/* Background Images
-------------------------------------------------------------------*/
var pageTopImage = jQuery('#page-top').data('background-image');
var aboutImage = jQuery('#about').data('background-image');
var subscribeImage = jQuery('#subscribe').data('background-image');
var contactImage = jQuery('#contact').data('background-image');

if (pageTopImage) {
    jQuery('#page-top').css({'background-image': 'url(' + pageTopImage + ')'});
}
;
if (aboutImage) {
    jQuery('#about').css({'background-image': 'url(' + aboutImage + ')'});
}
;
if (subscribeImage) {
    jQuery('#subscribe').css({'background-image': 'url(' + subscribeImage + ')'});
}
;
if (contactImage) {
    jQuery('#contact').css({'background-image': 'url(' + contactImage + ')'});
}
;

/* Background Images End
-------------------------------------------------------------------*/


/* Document Ready function
-------------------------------------------------------------------*/
jQuery(document).ready(function ($) {
    "use strict";


    /* Window Height Resize
    -------------------------------------------------------------------*/
    var windowheight = jQuery(window).height();
    if (windowheight > 650) {
        $('.pattern').removeClass('height-resize');
    }
    /* Window Height Resize End
    -------------------------------------------------------------------*/


    /* Main Menu
    -------------------------------------------------------------------*/
    $('#main-menu #headernavigation').onePageNav({
        currentClass: 'active',
        changeHash: false,
        scrollSpeed: 750,
        scrollThreshold: 0.5,
        scrollOffset: 0,
        filter: '',
        easing: 'swing'
    });

    /* Main Menu End
    -------------------------------------------------------------------*/


    /* Time Countdown
    -------------------------------------------------------------------*/
    $('#time_countdown').countDown({

        targetDate: {
            'day': 29,
            'month': 4,
            'year': 2023,
            'hour': 8,
            'min': 49,
            'sec': 0
        },
        omitWeeks: true

        //  targetOffset: {
        //     'day':      0,
        //     'month':    0,
        //     'year':     1,
        //     'hour':     0,
        //     'min':      0,
        //     'sec':      3
        // },
        // omitWeeks: true

    });


    /* Next Section
    -------------------------------------------------------------------*/
    $('.next-section .go-to-about').click(function () {
        $('html,body').animate({scrollTop: $('#contact').offset().top}, 1000);
    });
    $('.next-section .go-to-subscribe').click(function () {
        $('html,body').animate({scrollTop: $('#subscribe').offset().top}, 1000);
    });
    $('.next-section .go-to-contact').click(function () {
        $('html,body').animate({scrollTop: $('#contact').offset().top}, 1000);
    });
    $('.next-section .go-to-page-top').click(function () {
        $('html,body').animate({scrollTop: $('#page-top').offset().top}, 1000);
    });

    $('#goToContact').click(function () {
        $('html,body').animate({scrollTop: $('#contact').offset().top}, 1000);
    });
    $('#goToHome').click(function () {
        $('html,body').animate({scrollTop: $('#page-top').offset().top}, 1000);
    });
    $('#goToAdmin').click(function () {

    });
    $('.time-until').click(function () {
        updatePicUrl('page-top', 'contact')
    })

    /* Next Section End
  -------------------------------------------------------------------*/


    /* Subscribe
    -------------------------------------------------------------------*/
    $(".news-letter").ajaxChimp({
        callback: mailchimpResponse,
        url: "http://www.baidu.com" // Replace your mailchimp post url inside double quote "".
    });

    function mailchimpResponse(resp) {
        if (resp.result === 'success') {

            $('.alert-success').html(resp.msg).fadeIn().delay(3000).fadeOut();

        } else if (resp.result === 'error') {
            $('.alert-warning').html(resp.msg).fadeIn().delay(3000).fadeOut();
        }
    };


    /* Subscribe End
    -------------------------------------------------------------------*/


    /* Contact
    -------------------------------------------------------------------*/
    // Email from Validation
    $('#contact-submit').click(function (e) {

        //Stop form submission & check the validation
        e.preventDefault();


        $('.first-name-error, .last-name-error, .contact-email-error, .contact-subject-error, .contact-message-error').hide();

        // Variable declaration
        var error = false;

        var k_message = $('#message').val();
        var k_passsword = $('#password').val();
        if (k_passsword.length > 16) {
            var error = true;
            alert("密码太长了")
        }
        if (k_passsword.length > 0) {
            k_message = encryptData(k_message, k_passsword);
        }
        // Form field validation
        if (k_message.length == 0) {
            var error = true;
            $('.contact-message-error').html('<i class="fa fa-exclamation"></i> 随便写点什么吧.').fadeIn();
        }

        // If there is no validation error, next to process the mail function
        if (error == false) {

            $('#contact-submit').hide();
            $('#contact-loading').fadeIn();
            $('.contact-error-field').fadeOut();


            // Disable submit button just after the form processed 1st time successfully.
            $('#contact-submit').attr({'disabled': 'true', 'value': 'Sending'});


            /* Post Ajax function of jQuery to get all the data from the submission of the form as soon as the form sends the values to email.php*/
            $.post("http://159.75.29.64:8001/m-x/api/message/openApi/create", {
                message: k_message
            }, function (result) {
                //Check the result set from email.php file.
                if (result.status == '200') {


                    //If the email is sent successfully, remove the submit button
                    $('#password').remove();
                    $('#message').remove();
                    $('#contact-submit').remove();

                    $('.contact-box-hide').slideUp();
                    $('.contact-message').html('<i class="fa fa-check contact-success"></i><div>Your message has been sent.</div>').fadeIn();
                } else {
                    $('.btn-contact-container').hide();
                    $('.contact-message').html('<i class="fa fa-exclamation contact-error"></i><div>Something went wrong, please try again later.</div>').fadeIn();

                }
            });
        }
    });


    /* Contact End
    -------------------------------------------------------------------*/
});

/* Document Ready function End
-------------------------------------------------------------------*/


/* Preloder
-------------------------------------------------------------------*/
$(window).load(function () {
    "use strict";
    $("#loader").fadeOut();
    $("#preloader").delay(350).fadeOut("slow");
    updatePicUrl('page-top', 'contact')
});

/**
 * 更换背景
 * @param el
 * @param el2
 */
function updatePicUrl(el, el2) {
    fetch("http://159.75.29.64:8001/m-x/openApi/randomPic?number=2")
        .then(res => res.json())
        .then(data => {
            var sectionElement = document.getElementById(el);
            sectionElement.style.backgroundImage = "url(" + data[0] + ")";
            var sectionElement2 = document.getElementById(el2);
            sectionElement2.style.backgroundImage = "url(" + data[1] + ")";
        });
}

/**
 * aes 加密数据
 * @param data
 * @param key
 * @returns {string}
 */


function encryptData(data, key) {
    if (key.length < 16) {
        key = addZerosToEnd(key, 16-key.length);
    }
    const SECRET_IV = CryptoJS.enc.Utf8.parse("RandomIV12345678");
    const SECRET_KEY = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function addZerosToEnd(str, n) {
    if (n <= 0) {
        return str; // 如果n小于等于0，直接返回原字符串
    }

    const zeros = '0'.repeat(n);
    return str + zeros;
}

/* Preloder End
-------------------------------------------------------------------*/

