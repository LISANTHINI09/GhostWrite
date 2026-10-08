package com.ghostwrite.exception;

public class InvalidTrackingTokenException extends RuntimeException {
    public InvalidTrackingTokenException(String message) {
        super(message);
    }
}
