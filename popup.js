$(document).ready(function() {

  var SERVER_URL = "http://127.0.0.1:5000/SingleURL/v1/?url="

  var page = chrome.extension.getBackgroundPage();

  var url = SERVER_URL + page.getImageURL();

  $("#close-window").click(function() {
    window.close();
  });

  $("#image").attr("src", page.getImageURL());

  $.when(
    $.get(url, function(data) {
      $("#ocr-text").text(data.OCRText);
      $("#BestGuessedLabel").text(chrome.i18n.getMessage("BestGuessedLabel") + ' ' + data.BestGuessedLabel);

      if (data.Flag == false) {
        $("#Flag").text(chrome.i18n.getMessage("ImageFreeOfToxicContent"));
      } else {
        $("#Flag").text(chrome.i18n.getMessage("ToxicKeywordsFound"));
      }

      if (data.ReverseImageMetadataNone == true) {
        $("#FurtherRessources").text(chrome.i18n.getMessage("NoRelatedImages"));
        $("#KeywordsMostCommon").text(chrome.i18n.getMessage("NoRelatedImages"));
        $("#Flag").text(chrome.i18n.getMessage("NoRelatedImagesToClassify"));
        if (data.Flag == true) {
          $("#Flag").text(chrome.i18n.getMessage("ToxicKeywordsFound"));
        }
      }



      $.each(data.KeywordsMostCommonDE, function(key, value) {
        $("#KeywordsMostCommonDE").append(value[0] + " " + value[1] + "x" + "<br>");
      })

      $.each(data.KeywordsMostCommonEN, function(key, value) {
        $("#KeywordsMostCommonEN").append(value[0] + " " + value[1] + "x" + "<br>");
      })

      $.each(data.ReverseImagesMetadata, function(key, value) {
        $("#FurtherRessources").append(
          chrome.i18n.getMessage("ImageMatchType") + value.ReverseImageMatchType + "<br>" +
          chrome.i18n.getMessage("PageURL") + "<a target=_blank rel=noopener noreferrer href =" + value.ReverseImagePageURL + ">" + chrome.i18n.getMessage("ClickHere") + "</a><br>" +
          chrome.i18n.getMessage("PageLanguage") + value.Language + "<br>" +
          chrome.i18n.getMessage("ToxicContentBadWordsDetected") + value.Flag + "<br><br>");
      })
    }, "json")).done(function() {

    $("#0").css("display", "none");
    $("#1").show("slow");
  })



});