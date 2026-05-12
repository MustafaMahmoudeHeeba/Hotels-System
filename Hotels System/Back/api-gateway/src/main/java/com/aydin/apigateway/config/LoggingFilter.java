package com.aydin.apigateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class LoggingFilter {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    @Bean
    public GlobalFilter logFilter() {
        return (exchange, chain) -> {
            logger.info("Incoming request: {} {}", exchange.getRequest().getMethod(), exchange.getRequest().getURI());
            return chain.filter(exchange)
                        .doOnSuccess(aVoid -> logger.info("Response status code: {}", exchange.getResponse().getStatusCode()));
        };
    }
}
