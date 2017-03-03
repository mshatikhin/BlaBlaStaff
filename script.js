"use strict";
var STAFF_ITEM_WRAPPER_SELECTOR = "time-lines__wrapper";
var POPUP_SELECTOR = "blabla__popup";
var POPUP_IMAGE_SELECTOR = "blabla__popup_image";
var STAFF_ITEM_SELECTOR = "time-lines-titles__item";
var LINK_SELECTOR = "blabla__link";
var wrapper = null;
var rooms = {
    302: {
        description: "test",
        hasTV: true,
        space: "4-10"
    },
};
var BlaBlaStaff = (function () {
    function BlaBlaStaff() {
        this.handleClick = function (event) {
            event.stopPropagation();
            var target = event.target;
            while (target != wrapper) {
                if (target && target.classList.contains(STAFF_ITEM_SELECTOR)) {
                    var roomElement = target.lastElementChild;
                    var isRoomElement = roomElement && roomElement.tagName == "SPAN";
                    if (isRoomElement) {
                        BlaBlaStaff.showPopup(roomElement);
                        return;
                    }
                }
                target = target.parentNode;
            }
        };
        document.addEventListener("click", BlaBlaStaff.removePopup);
        window.addEventListener("scroll", BlaBlaStaff.removePopup);
        window.addEventListener("resize", BlaBlaStaff.removePopup);
    }
    BlaBlaStaff.createPhotoElement = function (roomNumber) {
        var photo = document.createElement("img");
        photo.classList.add(POPUP_IMAGE_SELECTOR);
        var imageUrl = "rooms/" + roomNumber + ".jpg";
        photo.src = chrome.extension.getURL(imageUrl);
        photo.setAttribute("alt", roomNumber);
        return photo;
    };
    BlaBlaStaff.createInfoElement = function (roomNumber) {
        var info = document.createElement("div");
        var room = rooms[roomNumber];
        info.innerHTML = room == null
            ? ""
            : " <div class=\"blabla__info\">\u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439: " + room.description + "</div> \n                <div class=\"blabla__info\">\u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043C\u0435\u0441\u0442: " + room.space + "</div> \n                <div class=\"blabla__info\">" + (room.hasTV ? "есть телевизор" : "") + "</div> \n            ";
        return info;
    };
    BlaBlaStaff.showPopup = function (roomElement) {
        BlaBlaStaff.removePopup();
        var roomNumber = roomElement.innerHTML;
        var newPopup = document.createElement("div");
        newPopup.id = POPUP_SELECTOR;
        newPopup.classList.add(POPUP_SELECTOR);
        newPopup.appendChild(BlaBlaStaff.createPhotoElement(roomNumber));
        newPopup.appendChild(BlaBlaStaff.createInfoElement(roomNumber));
        BlaBlaStaff.setPosition(roomElement, newPopup);
        document.documentElement.appendChild(newPopup);
    };
    BlaBlaStaff.removePopup = function () {
        var popup = document.getElementById(POPUP_SELECTOR);
        popup && popup.parentNode && popup.parentNode.removeChild(popup);
    };
    BlaBlaStaff.setPosition = function (target, popup) {
        var rect = target.getBoundingClientRect();
        popup.style.top = rect.top - 150 + "px";
        popup.style.left = rect.left - 400 + "px";
    };
    return BlaBlaStaff;
}());
window.onload = function () {
    var container = new BlaBlaStaff();
    setTimeout(function () {
        var items = document.getElementsByClassName(STAFF_ITEM_SELECTOR);
        [].slice.call(items).forEach(function (i) { return i.classList.add(LINK_SELECTOR); });
        wrapper = document.getElementsByClassName(STAFF_ITEM_WRAPPER_SELECTOR)[0];
        wrapper.addEventListener("click", container.handleClick);
    }, 1000);
};
