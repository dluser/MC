!function(){"use strict";function e(e){if(!e)return!0;if(e.length>20)return!1;var t=e.replace(/[\n|\t]*/g,"").toLowerCase();return t&&""!==t&&"<br>"!=t&&"<p>&nbsp;<br></p>"!=t&&"<p><br></p>"!=t&&"<p>&nbsp;</p>"!=t&&"&nbsp;"!=t&&" "!=t&&"&nbsp;<br>"!=t&&" <br>"!=t?!1:!0}function t(t){var a=t.editor,o=a.editable?a.editable():"wysiwyg"==a.mode?a.document&&a.document.getBody():a.textarea,i=t.listenerData;if(o){if("wysiwyg"==a.mode){if(CKEDITOR.dialog._.currentTop)return;if(!o)return;e(o.getHtml())&&(o.setHtml(i),o.addClass("placeholder"),a.updateElement())}if("source"==a.mode){if(n)return void("mode"==t.name&&o.setAttribute("placeholder",i));e(o.getValue())&&(o.setValue(i),o.addClass("placeholder"))}}}function a(e){var t=e.editor,a=t.editable?t.editable():"wysiwyg"==t.mode?t.document&&t.document.getBody():t.textarea;if(a){if("wysiwyg"==t.mode){if(!a.hasClass("placeholder"))return;if(a.removeClass("placeholder"),CKEDITOR.dtd[a.getName()].p){a.setHtml("<p><br/></p>");var o=new CKEDITOR.dom.range(t.document);o.moveToElementEditablePosition(a.getFirst(),!0),t.getSelection().selectRanges([o])}else a.setHtml(" ")}if("source"==t.mode){if(!a.hasClass("placeholder"))return;a.removeClass("placeholder"),a.setValue("")}}}function o(e){return e?e.getAttribute("lang")||o(e.getParent()):null}var n="placeholder"in document.createElement("textarea");CKEDITOR.plugins.add("confighelper",{getPlaceholderCss:function(){return".placeholder{ color: #999; }"},onLoad:function(){CKEDITOR.addCss&&CKEDITOR.addCss(this.getPlaceholderCss())},init:function(i){i.on("mode",function(e){e.editor.focusManager.hasFocus=!1});var l=i.element.getAttribute("placeholder")||i.config.placeholder;if(l){i.addCss&&i.addCss(this.getPlaceholderCss());var r=CKEDITOR.document.getHead().append("style");r.setAttribute("type","text/css");var d="textarea.placeholder { color: #999; font-style: italic; }";CKEDITOR.env.ie&&CKEDITOR.env.version<11?r.$.styleSheet.cssText=d:r.$.innerHTML=d,i.on("getData",function(e){var t=i.editable?i.editable():"wysiwyg"==i.mode?i.document&&i.document.getBody():i.textarea;t&&t.hasClass("placeholder")&&(e.data.dataValue="")}),i.on("afterSetData",function(a){if(!(CKEDITOR.dialog._.currentTop||"source"==i.mode&&n)){var o=i.editable?i.editable():"wysiwyg"==i.mode?i.document&&i.document.getBody():i.textarea;o&&(e(a.data.dataValue)?t(a):o.hasClass("placeholder")&&o.removeClass("placeholder"))}},null,l),i.on("blur",t,null,l),i.on("mode",t,null,l),i.on("contentDom",t,null,l),i.on("focus",a),i.on("beforeModeUnload",a)}var s=i.config.contentsLanguage||o(i.element);if(s&&!i.config.scayt_sLang){localStorage&&localStorage.removeItem("scayt_0_lang");var c={en:"en_US","en-us":"en_US","en-gb":"en_GB","pt-br":"pt_BR",da:"da_DK","da-dk":"da_DK","nl-nl":"nl_NL","en-ca":"en_CA","fi-fi":"fi_FI",fr:"fr_FR","fr-fr":"fr_FR","fr-ca":"fr_CA",de:"de_DE","de-de":"de_DE","el-gr":"el_GR",it:"it_IT","it-it":"it_IT","nb-no":"nb_NO",pt:"pt_PT","pt-pt":"pt_PT",es:"es_ES","es-es":"es_ES","sv-se":"sv_SE"};i.config.scayt_sLang=c[s.toLowerCase()]}var g=function(e){if("object"==typeof e)return e;var t,a=e.split(";"),o={};for(t=0;t<a.length;t++){var n=a[t].split(":");if(3==n.length){var i=n[0],l=n[1],r=n[2];o[i]||(o[i]={}),o[i][l]||(o[i][l]=[]),o[i][l].push(r)}}return o};CKEDITOR.on("dialogDefinition",function(e){if(i==e.editor){var t,a,o,n,l,r=e.data.name,d=e.data.definition;if("removeDialogFields"in i._||!i.config.removeDialogFields||(i._.removeDialogFields=g(i.config.removeDialogFields)),i._.removeDialogFields&&(t=i._.removeDialogFields[r]))for(o in t)for(n=t[o],l=d.getContents(o),a=0;a<n.length;a++)l.remove(n[a]);if("hideDialogFields"in i._||!i.config.hideDialogFields||(i._.hideDialogFields=g(i.config.hideDialogFields)),i._.hideDialogFields&&(t=i._.hideDialogFields[r]))for(o in t)for(n=t[o],l=d.getContents(o),a=0;a<n.length;a++)l.get(n[a]).hidden=!0;if(i.config.dialogFieldsDefaultValues&&(t=i.config.dialogFieldsDefaultValues[r]))for(o in t){n=t[o],l=d.getContents(o);for(var s in n){var c=l.get(s);c&&(c["default"]=n[s])}}}})}})}();