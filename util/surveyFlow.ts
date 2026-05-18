import type { GewichteteAntwort } from "@/types/Befragung";

const SURVEY_PATHS = ["/befragung", "/gewichtung", "/ergebnis"] as const;

export type SurveyPath = (typeof SURVEY_PATHS)[number];

export function normalizePathname(pathname: string | null): string {
    if (!pathname || pathname === "/") return "/";
    return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function isSurveyPath(pathname: string | null): boolean {
    return SURVEY_PATHS.includes(normalizePathname(pathname) as SurveyPath);
}

export function withTrailingSlash(path: string): string {
    if (path === "/") return "/";
    return path.endsWith("/") ? path : `${path}/`;
}

export function buildSurveyUrl(
    path: SurveyPath,
    answers: number[] | GewichteteAntwort[]
): string {
    const encoded = encodeURIComponent(JSON.stringify(answers));
    return `${withTrailingSlash(path)}?answer=${encoded}`;
}

export function parseSurveyAnswersParam<T>(value: string | null): T[] {
    if (!value) return [];
    try {
        const decoded = decodeURIComponent(value);
        const parsed = JSON.parse(decoded);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to parse survey answers from URL:", error);
        return [];
    }
}
