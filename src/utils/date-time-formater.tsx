import moment, {Moment} from "moment";
import DateTimeFormat from "../utils/date-time-format";

export const DateTimeFormatter = () =>
{
    const momentToDate = (momentDate : Moment) => {
        return moment(momentDate).format(DateTimeFormat.DATE);
    }
    return {momentToDate}

}
export default DateTimeFormatter;
