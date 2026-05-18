export function scrollElementIntoView(
    element: HTMLElement,
    reduceMotion: boolean
) {
    element.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
        inline: "center",
    });
}
