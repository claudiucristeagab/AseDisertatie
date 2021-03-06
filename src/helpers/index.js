import * as moment from 'moment';

export const rentalType = (isShared) => isShared ? 'shared' : 'entire';
export const getRangedDates = (startDate, endDate, dateFormat) => {
    const tempDates = [];
    const momentEndDate = moment(endDate);
    let momentStartDate = moment(startDate);

    while(momentStartDate < momentEndDate){
        tempDates.push(momentStartDate.format(dateFormat))
        momentStartDate = momentStartDate.add(1, 'day');
    }

    tempDates.push(momentEndDate.format(dateFormat));

    return tempDates;
}

export const formatDate = (date) => {
    return moment(date).format('Y/MM/DD');
}

export const formatStripeAmount = amount => amount/100;