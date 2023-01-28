document.addEventListener("contextmenu", (event) => event.preventDefault());
$(document).ready(function () {
  let timeOver = false;
  let timeInSeconds = 0;
  let timeInterval;
  $(".retake").click(() => {
    clearInterval(timeInterval);
    timeInSeconds = 0;
    timeInterval = setInterval(timer, 1000);
    // remove correct option
    $("label")
      .removeClass("text-success font-weight-bold")
      .children("span")
      .text("");
    $("#quizForm").removeClass("d-none");
    $(".timeHead").removeClass("d-none");
    $("#result").addClass("d-none");

    $("#quizForm")[0].reset();
    $(".submit").attr("disabled", false);
    $(".submit").text("Submit");
    $("#quizForm .feedback").addClass("d-none");
  });
  let seconds;
  let minutes;
  let time;

  timeInterval = setInterval(timer, 1000);
  function timer() {
    timeInSeconds += 1;
    setQuizTimer();
  }
  var setQuizTimer = () => {
    seconds = timeInSeconds % 60;
    minutes = Math.floor(timeInSeconds / 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    time = `${minutes}:${seconds}`;
    $(".timer").text(time);

    // if (
    //   (quizType == "final" || quizType == "mid") &&
    //   timeInSeconds == examTime
    // ) {
    //   $("#quizForm [type=radio]").removeAttr("required");
    //   timeOver = true;
    //   $("#quizForm .submit").click();
    // }
  };

  $("#quizForm").submit(function (e) {
    console.log("test1");
    e.preventDefault();

    submitQuiz(e);
  });
  let submitQuiz = (e) => {
    clearInterval(timeInterval);
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    console.log(time);
    // adding time at top of array
    formData.unshift({ name: "time", value: time });
    submitMsg = "Submitting you test.";
    loading(true, submitMsg);
    $.ajax({
      url: "/dashboard/salesperson/take-quiz",
      type: "POST",
      data: formData,
      dataType: "json",
      success: ({
        correctAns,
        correctCount,
        point,
        showAns,
        wrongAns,
        wrongCount,
        percent,
        grade,
        explain,
        error,
      }) => {
        loading(false);
        if (!error) {
          $(".submit").attr("disabled", true);
          $(".submit").text("Submitted");

          // $('#quizForm').addClass('d-none')
          $(".timeHead").addClass("d-none");
          $("#result").removeClass("d-none");

          // if point then show the result
          // if (point) {

          $("#result").removeClass("d-none");
          $("#result .percent").text(`${percent}%`);
          if (grade == "passed") {
            $("#result .percent")
              .removeClass("text-danger")
              .addClass("text-success");
          } else {
            $("#result .percent")
              .removeClass("text-success")
              .addClass("text-danger");
          }

          $("#result .points").text(`${point}/${Number(noOfQuestions)}`);
          $("#result .time").text(time);
          $("#result .correct").text(
            `${reviewQuiz == "true" ? correctAns.length : correctCount}`
          );
          $("#result .wrong").text(
            `${reviewQuiz == "true" ? wrongAns.length : wrongCount}`
          );
          // scroll to top to show result.
          $([document.documentElement, document.body]).animate(
            {
              scrollTop: $("#result").offset().top,
            },
            600
          );

          // }
          if (reviewQuiz == "true") {
            // explanation
            explain.forEach((item) => {
              let questionDom = $(`#quizForm [name=${item.question}]`).parents(
                ".form-group-head"
              );
              questionDom
                .find(".feedback")
                .removeClass("d-none")
                .find(".explain")
                .text(`Explanation: ${item.explain}`);
            });

            //for the wrong answer
            if (wrongAns.length != 0) {
              wrongAns.forEach((ans) => {
                var parent = $(`#quizForm [name=${ans}]`).parents(
                  ".form-group-head"
                );
                parent
                  .find(".feedback")
                  .removeClass("d-none")
                  .find(".msg")
                  .addClass("text-danger");
                parent.find(".feedback .msg").text("Your answer is wrong.");
              });
            }
            // correct question at the end of question
            if (correctAns.length) {
              correctAns.forEach((ans) => {
                var parent = $(`#quizForm [name=${ans}]`).parents(
                  ".form-group-head"
                );
                parent
                  .find(".feedback")
                  .removeClass("d-none")
                  .find(".msg")
                  .removeClass("text-danger")
                  .addClass("text-success");
                parent.find(".feedback .msg").text("Correct.");
              });
            }
            // showing the correct option
            if (wrongAns && showAns) {
              showAns.forEach((correct) => {
                $(`#quizForm [for=${correct}]`)
                  .addClass("text-success font-weight-bold")
                  .children("span")
                  .text("(Correct)");
              });
            }
          }
        } else {
          alert(error);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  };
  var loading = (isLoading, msg = "Loading") => {
    var spinnerContainer = document.querySelector(".spinner");
    var quizContainer = document.querySelector("#quizForm");
    var text = spinnerContainer.querySelector(".text");
    text.textContent = msg;
    if (isLoading) {
      spinnerContainer.classList.replace("d-none", "d-flex");
      quizContainer.classList.add("opacity-25", "event-none");
    } else {
      quizContainer.classList.remove("opacity-25", "event-none");
      spinnerContainer.classList.replace("d-flex", "d-none");
    }
  };
});