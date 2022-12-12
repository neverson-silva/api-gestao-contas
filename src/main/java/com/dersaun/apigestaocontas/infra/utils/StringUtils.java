package com.dersaun.apigestaocontas.infra.utils;

import java.util.Arrays;
import java.util.concurrent.atomic.AtomicReference;

public class StringUtils {


    public static String beautify(String value) {

        var text = value.toLowerCase();
        var words = Arrays.stream(text.split(" ")).toList().stream().filter(word -> !word.trim().isEmpty()).toList();
        final AtomicReference<String> previous = new AtomicReference<String>("");
        var builder = new StringBuilder();

        words.forEach(word -> {
            String previousAtomic = previous.get();

            if (previousAtomic == null || previousAtomic.isEmpty()) {
                builder.append(StringUtils.capitalize(word));
            } else if (Palavras.SIGLA_ESTADOS_ALGARISMOS_ROMANOS.contains(word)) {
                builder.append(word.toUpperCase());

            } else if (Palavras.PREPOSICOES.contains(word) && !previousAtomic.contains("-")) {
                builder.append(word);
            } else {
                builder.append(StringUtils.capitalize(word));
            }
            previous.set(word);
            builder.append(" ");
        });

        return builder.toString();
    }

    public static String capitalize(String text) {
        return String.valueOf(text.charAt(0)).toUpperCase() + text.substring(1).toLowerCase();
    }

}
