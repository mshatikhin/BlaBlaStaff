"use strict";
declare let chrome: any;

const STAFF_ITEM_WRAPPER_SELECTOR = "time-lines__wrapper";
const POPUP_SELECTOR = "blabla__popup";
const POPUP_IMAGE_SELECTOR = "blabla__popup_image";
const STAFF_ITEM_SELECTOR = "time-lines-titles__item";
const LINK_SELECTOR = "blabla__link";

interface RoomInfo {
    description: string;
    hasTV: boolean;
    space: string;
}

interface Rooms {
    302: RoomInfo;
}

let wrapper = null;

const rooms: Rooms = {
    302: {
        description: "test",
        hasTV: true,
        space: "4-10"
    },
};

class BlaBlaStaff {

    constructor() {
        document.addEventListener("click", BlaBlaStaff.removePopup);
        window.addEventListener("scroll", BlaBlaStaff.removePopup);
        window.addEventListener("resize", BlaBlaStaff.removePopup);
    }

    handleClick = function (event) {
        event.stopPropagation();

        let target = event.target;
        while (target != wrapper) {
            if (target && target.classList.contains(STAFF_ITEM_SELECTOR)) {
                let roomElement = target.lastElementChild;
                const isRoomElement = roomElement && roomElement.tagName == "SPAN";
                if (isRoomElement) {
                    BlaBlaStaff.showPopup(roomElement);
                    return;
                }
            }
            target = target.parentNode;
        }
    };

    static createPhotoElement(roomNumber) {
        const photo = document.createElement("img");
        photo.classList.add(POPUP_IMAGE_SELECTOR);

        const imageUrl = `rooms/${roomNumber}.jpg`;
        photo.src = chrome.extension.getURL(imageUrl);
        photo.setAttribute("alt", roomNumber);
        return photo;
    }

    static createInfoElement(roomNumber) {
        const info = document.createElement("div");
        let room = rooms[roomNumber];
        info.innerHTML = room == null
            ? ""
            : ` <div class="blabla__info">комментарий: ${room.description}</div> 
                <div class="blabla__info">количество мест: ${room.space}</div> 
                <div class="blabla__info">${room.hasTV ? "есть телевизор" : ""}</div> 
            `;
        return info;
    }

    static showPopup(roomElement) {
        BlaBlaStaff.removePopup();

        let roomNumber = roomElement.innerHTML;

        const newPopup = document.createElement("div");
        newPopup.id = POPUP_SELECTOR;
        newPopup.classList.add(POPUP_SELECTOR);
        newPopup.appendChild(BlaBlaStaff.createPhotoElement(roomNumber));
        newPopup.appendChild(BlaBlaStaff.createInfoElement(roomNumber));

        BlaBlaStaff.setPosition(roomElement, newPopup);

        document.documentElement.appendChild(newPopup);
    }

    static removePopup() {
        const popup = document.getElementById(POPUP_SELECTOR);
        popup && popup.parentNode && popup.parentNode.removeChild(popup);
    }

    static setPosition(target, popup) {
        const rect = target.getBoundingClientRect();
        popup.style.top = rect.top - 150 + "px";
        popup.style.left = rect.left - 400 + "px";
    }
}

window.onload = function () {
    const container = new BlaBlaStaff();
    setTimeout(function () {
        const items = document.getElementsByClassName(STAFF_ITEM_SELECTOR);
        [].slice.call(items).forEach(i => i.classList.add(LINK_SELECTOR));

        wrapper = document.getElementsByClassName(STAFF_ITEM_WRAPPER_SELECTOR)[0];
        wrapper.addEventListener("click", container.handleClick);

    }, 1000);
};