!function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=87)}({2:function(e,r,t){"use strict";e.exports=function(e){"function"==typeof e?e():"object"==typeof e&&Object.keys(e).forEach((function(r){"function"==typeof e[r]&&e[r]()}))}},4:function(e,r,t){"use strict";e.exports=function(e,r){(function(e){$(e).find(".form-control.is-invalid").removeClass("is-invalid")}(e),$(".alert",e).remove(),"object"==typeof r&&r.fields&&Object.keys(r.fields).forEach((function(t){if(r.fields[t]){var n=$(e).find('[name="'+t+'"]').parent().children(".invalid-feedback");n.length>0&&(Array.isArray(r[t])?n.html(r.fields[t].join("<br/>")):n.html(r.fields[t]),n.siblings(".form-control").addClass("is-invalid"))}})),r&&r.error)&&("FORM"===$(e).prop("tagName")?$(e):$(e).parents("form")).prepend('<div class="alert alert-danger" role="alert">'+r.error.join("<br/>")+"</div>")}},87:function(e,r,t){"use strict";var n=t(2);$(document).ready((function(){n(t(88))}))},88:function(e,r,t){"use strict";var n=t(4);e.exports={submitProfile:function(){$("form.edit-profile-form").submit((function(e){var r=$(this);e.preventDefault();var t=r.attr("action");return r.spinner().start(),$("form.edit-profile-form").trigger("profile:edit",e),$.ajax({url:t,type:"post",dataType:"json",data:r.serialize(),success:function(e){r.spinner().stop(),e.success?location.href=e.redirectUrl:n(r,e)},error:function(e){e.responseJSON.redirectUrl&&(window.location.href=e.responseJSON.redirectUrl),r.spinner().stop()}}),!1}))},submitPassword:function(){$("form.change-password-form").submit((function(e){var r=$(this);e.preventDefault();var t=r.attr("action");return r.spinner().start(),$("form.change-password-form").trigger("password:edit",e),$.ajax({url:t,type:"post",dataType:"json",data:r.serialize(),success:function(e){r.spinner().stop(),e.success?location.href=e.redirectUrl:n(r,e)},error:function(e){e.responseJSON.redirectUrl&&(window.location.href=e.responseJSON.redirectUrl),r.spinner().stop()}}),!1}))}}}});