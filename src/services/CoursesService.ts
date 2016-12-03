/**
 *
 * @type {Map<string, ICourse>}
 */
const coursesMap: Map<string, ICourse> = new Map<string, ICourse>();

const courses: ICourse[] = require('../../resources/courses.json')
    .map((course: ICourse) => {
        course.href = `/training/inscription/${course.value}`;
        coursesMap.set(course.value, course);
        return course;
    });
/**
 * Return an array of ICourse.
 */
export function getCourses(): ICourse[] {
    return courses;
}
/**
 *
 * @param course
 * @returns {any}
 */
export function getCourse(course: string): ICourse {
    return coursesMap.get(course);
}
/**
 *
 * @param course
 * @returns {boolean}
 */
export function courseExists(course: string): boolean {
    return coursesMap.has(course);
}

/**
 *
 * @returns {RegExp}
 */
export function getValidator() {

    const list = courses.map((course: ICourse) => {
        return course.value;
    }).join('|');

    return new RegExp(list);
}