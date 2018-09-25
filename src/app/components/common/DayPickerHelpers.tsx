import { AfterModifier, DayModifiers, BeforeModifier } from "react-day-picker/types/common";
import * as moment from 'moment';
import * as React from "react";
import { CaptionElementProps } from "react-day-picker/types/props";
import DayPickerInput from "react-day-picker/DayPickerInput";

export const Today = new Date();
const currentYear = Today.getFullYear();
export const TwoHundredthYearPast = new Date(currentYear - 200, 0);
export const TenthYearPast = new Date(currentYear - 10, 0);
export const TenthYearFuture = new Date(currentYear + 10, 11);

export const DefaultDateFormat = "DD/MM/YYYY";
const englishLocale = "en";

export const formatDate = (date: Date, format?: string, locale?: string): string => {
    if(date == null){
        return '';
    }
    var mo = moment(date);
    if(locale != null){
        mo.locale(locale);
    }
    if(format != null){
        return mo.format(format);
    }
    return mo.format(DefaultDateFormat);
}

export const parseDate = (str: string, format: string, locale: string): Date | void => {
    return moment(str, format).toDate();
}

export const disableFutureDaysModifier = (): AfterModifier => {
    let today = moment().toDate();
    return { after: today }
};

export const disablePastDaysModifier = (): BeforeModifier => {
    let today = moment().toDate();
    return { before: today }
};

interface YearMonthFormProps {
    onChange: (date: Date) => void;
    fromMonth: Date;
    toMonth: Date;
}

const YearMonthForm: React.SFC<CaptionElementProps & YearMonthFormProps> = (props) => {
    const { date, localeUtils, onChange, fromMonth, toMonth } = props;
    const months = localeUtils.getMonths(englishLocale);

    const years = [];
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChange = function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { year, month } = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    return (
        <div className="DayPicker-Caption">
        <select className='uk-select' name="month" onChange={(e) => handleChange(e)} value={date.getMonth()}>
            {months.map((month, i) => (
            <option key={month} value={i}>
                {month}
            </option>
            ))}
        </select>
        <select className='uk-select uk-margin-small-left' name="year" onChange={(e) => handleChange(e)} value={date.getFullYear()}>
            {years.map(year => (
            <option key={year} value={year}>
                {year}
            </option>
            ))}
        </select>
        </div>
    );
}

interface DayPickerWithMonthYearProps {
    disableFuture?: boolean;
    disablePast?: boolean;
    selectedDay: moment.Moment;
    fromMonth?: Date;
    toMonth?: Date;
    onDayChange?: (day: moment.Moment, DayModifiers: DayModifiers, dayPickerInput: DayPickerInput) => void;
}

interface DayPickerState {
    month: Date;
}

export class DayPickerWithMonthYear extends React.Component<DayPickerWithMonthYearProps, DayPickerState> {
    constructor(props: DayPickerWithMonthYearProps){
        super();
        this.state = {
            month: props.selectedDay && props.selectedDay.isValid() ? props.selectedDay.toDate() : moment().utc().toDate()
        }
    }
    
    handleYearMonthChange(d: Date): any {
        this.setState({
            ...this.state,
            month: d
        });
    }

    render() {
        var fromMonth = this.props.fromMonth ? this.props.fromMonth : TenthYearPast;
        var toMonth = this.props.toMonth ? this.props.toMonth : TenthYearFuture;

        var disabledDays = this.props.disableFuture ? disableFutureDaysModifier() : this.props.disablePast ? disablePastDaysModifier() : null;

        var hasValidSelection = this.props.selectedDay && this.props.selectedDay.isValid();
        var selectedDay = hasValidSelection ? this.props.selectedDay.toDate() : null;
        return (
            <DayPickerInput
                component={(inputProps: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => (
                    <div className="icon-input-container uk-grid uk-grid-collapse">
                        <input {...inputProps} className="uk-width-expand uk-input"/>
                        <div tabIndex={-1} className="clickable-icon-container uk-width-auto uk-flex uk-flex-middle" 
                            onClick={() => inputProps.onClick(null)} 
                            onBlur={() => inputProps.onBlur(null) }>
                            <i className="far fa-calendar-alt"></i>
                        </div>
                    </div>
                )}
                dayPickerProps={{
                    selectedDays: selectedDay,
                    disabledDays: disabledDays,
                    month: this.state.month,
                    fromMonth: fromMonth,
                    toMonth: toMonth,
                    captionElement: (props: CaptionElementProps) => (
                        <YearMonthForm 
                            {...props} 
                            onChange={(d) => this.handleYearMonthChange(d)}
                            fromMonth={fromMonth}
                            toMonth={toMonth} />
                    )
                }}
                format={DefaultDateFormat}
                formatDate={formatDate}
                parseDate={parseDate}
                placeholder='Select Date'
                value={formatDate(selectedDay)}
                onDayChange={(d: Date, modifiers: DayModifiers, dayPickerInput: DayPickerInput) => this.props.onDayChange(moment(d), modifiers, dayPickerInput)}/>
        )
    }
}