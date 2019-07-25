import { DayLog } from './time-entries';


export const dayLog1: DayLog = {
    date: "2019-07-22", dayOfWeek: 1, timeEntries: {
        total_count: 0,
        offset: 0,
        limit: 0,
        time_entries: [{
            activity: { id: 9, name: "Development" },
            comments: "a",
            created_on: "2019-07-17T08:48:35Z",
            hours: 8,
            id: 29329,
            isNew: true,
            issue: { id: 4411 },
            project: { id: 112, name: "Redmine test" },
            spent_on: "2019-07-22",
            updated_on: "2019-07-17T08:48:35Z",
            user: { id: 56, name: "John Doe" }
        }]
    }, hoursLogged: 8
};

export const dayLog2: DayLog = {
    date: "2019-07-22", dayOfWeek: 1, timeEntries: {
        total_count: 0,
        offset: 0,
        limit: 0,
        time_entries: [{
            activity: { id: 9, name: "Development" },
            comments: "a",
            created_on: "2019-07-17T08:48:35Z",
            hours: 8.2,
            id: 29329,
            isNew: true,
            issue: { id: 4411 },
            project: { id: 112, name: "Redmine test" },
            spent_on: "2019-07-22",
            updated_on: "2019-07-17T08:48:35Z",
            user: { id: 56, name: "John Doe" }
        }, {
            activity: { id: 9, name: "Development" },
            comments: "a",
            created_on: "2019-07-17T08:48:35Z",
            hours: 2.05,
            id: 29329,
            isNew: true,
            issue: { id: 4411 },
            project: { id: 112, name: "Redmine test" },
            spent_on: "2019-07-22",
            updated_on: "2019-07-17T08:48:35Z",
            user: { id: 56, name: "John Doe" }
        }]
    }, hoursLogged: 10.25
};

export const emptyDayLog: DayLog = {
    date: "2019-07-22", dayOfWeek: 1, timeEntries: {
        total_count: 0,
        offset: 0,
        limit: 0,
        time_entries: []
    }, hoursLogged: 0
}
