import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOTP() {
  return (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString(); //Return random number between 100000-999999
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === currentDate.getFullYear() ? "numeric" : undefined,
  };

  return date.toLocaleDateString("en-US", options);
}

export function removeAllCookies() {
  Object.keys(Cookies.get()).forEach(function (cookieName) {
    Cookies.remove(cookieName);
  });
  window.location.reload();
}

export function goto(url: string, timeToProceed: number = 0) {
  setTimeout(() => {
    window.location.href = url;
  }, timeToProceed);
}

export function applyDiscount(price: number, discount: number) {
  let discountedPrice = Math.floor(price * (1 - discount / 100));
  discountedPrice = discountedPrice - (discountedPrice % 1) + 0.99;
  return discountedPrice;
}

export function setStateDelayed(setState: void, time: number) {
  setTimeout(() => {
    setState;
  }, time);
}

export function newAbortSignal() {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 5000 || 0);

  return abortController.signal;
}

export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
  configurable: true,
});
