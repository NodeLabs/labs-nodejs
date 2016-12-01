let coursesMap: {[key: string]: ICourse } = {};

const courses: ICourse[] = require('../conf/courses.json')
    .map((course: ICourse) => {
        course.href = `/training/inscription/${course.value}`;
        coursesMap[course.value] = course;
        return course;
    });
/**
 *
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
    return coursesMap[course];
}
/**
 *
 * @param course
 * @returns {boolean}
 */
export function courseExists(course: string): boolean {
    return !!coursesMap[course];
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