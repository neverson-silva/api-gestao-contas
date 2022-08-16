package com.dersaun.apigestaocontas.infra.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateUtils {

    public static LocalDate toLocalDate(String date) {
        Date data = toDate(date, "yyyy-MM-dd");

        if (data == null) {
            return null;
        }
        return data.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }

    public static Date toDate( String date, String pattern) {

        var parser = new SimpleDateFormat(pattern == null ? "yyyy-MM-dd HH:mm:ss" : pattern);
        try {
            return parser.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static int getLastDayOfMonth(LocalDate data) {
        var calendar = GregorianCalendar.from(data.atStartOfDay(ZoneId.systemDefault()));
        return calendar.getActualMaximum(Calendar.DATE);
    }
}