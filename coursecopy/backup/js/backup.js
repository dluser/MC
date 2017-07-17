// Variable to hold request
$(document).ready(function(){
    var request;
    $("#success").hide();
    // Bind to the submit event of our form
    $("#foo").submit(function(event){
        var this_master = $(this);

        this_master.find('input[type="checkbox"]').each( function () {
            var checkbox_this = $(this);


            if( checkbox_this.is(":checked") == true ) {
                checkbox_this.attr('value','Yes');
            } else {
                checkbox_this.prop('checked',true);
                //DONT' ITS JUST CHECK THE CHECKBOX TO SUBMIT FORM DATA    
                checkbox_this.attr('value','No');
            }
        })

        // Prevent default posting of form - put here to work in case of errors
        event.preventDefault();

        // Abort any pending request
        if (request) {
            request.abort();
        }
        // setup some local variables
        var $form = $(this);

        // Let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");

        // Serialize the data in the form
        var serializedData = $form.serialize();

        // Let's disable the inputs for the duration of the Ajax request.
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        $inputs.prop("disabled", true);

        // Fire off the request to /form.php
        request = $.ajax({
            url: "https://script.google.com/macros/s/AKfycbzObUX6IZO-F1sKZmO38vx6nw406o1L90_quZwinb60gCoQf9A/exec",
            type: "post",
            data: serializedData
        });

        // Callback handler that will be called on success
        request.done(function (response, textStatus, jqXHR){
            // Log a message to the console
            console.log("Hooray, it worked!");
            console.log(response);
            $("#success").show();
            $("#form-contents").hide();
        });

        // Callback handler that will be called on failure
        request.fail(function (jqXHR, textStatus, errorThrown){
            // Log the error to the console
            console.error(
                "The following error occurred: "+
                textStatus, errorThrown
            );
            $("#success").show();
            $("#success").html("<p>Something went wrong...Please refresh and submit your course copy request again.</p>");
            $("#form-contents").hide();
        });

        // Callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
            // Reenable the inputs
            $inputs.prop("disabled", false);
        });
    });
});