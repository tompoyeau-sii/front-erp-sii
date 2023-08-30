import {
    eachWeekOfInterval,
    getISOWeek,
    startOfWeek,
    endOfWeek,
    format,
} from "date-fns";

//Génére la liste des semaines pour une année passé en paramètre et son année +1
export function generateWeekList(year) {
    const startDate = new Date(year, 0, 1); // Premier jour de l'année
    const endDate = new Date(year + 1, 11, 31); // Dernier jour de l'année

    const allWeeks = eachWeekOfInterval({
        start: startDate,
        end: endDate,
        weekStartsOn: 1,
    });
    const weekList = allWeeks.map((date) => {
        const weekNumber = getISOWeek(date);
        const startDateOfWeek = startOfWeek(date, { weekStartsOn: 1 });
        const endDateOfWeek = endOfWeek(date, { weekStartsOn: 1 });
        return {
            weekNumber,
            startDate: format(startDateOfWeek, "yyyy-MM-dd"),
            endDate: format(endDateOfWeek, "yyyy-MM-dd"),
        };
    });
    return weekList;
};

//Retourne la liste de semaine entre la S14 et la S13 de l'année d'après
export function weeksFilter(weeks) {
    let weeksFiltered = [];
    let i = 0;
    let tour = false;
    weeks.forEach((week) => {
        i++;
        if (i > 14 && !tour) {
            weeksFiltered.push(week);
        } else if (i < 14 && tour == true) {
            weeksFiltered.push(week);
        }
        if (i == 53) {
            i = 0;
            tour = true;
        }
    });
    return weeksFiltered;
};
