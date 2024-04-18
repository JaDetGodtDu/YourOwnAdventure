package com.example.yourownadventure.api;

import com.example.yourownadventure.dto.MyResponse;
import com.example.yourownadventure.service.OpenAiService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * This class handles fetching a joke via the ChatGPT API, but is IP-rate limited.
 */
@RestController
@RequestMapping("/api/v1/limited")
@CrossOrigin(origins = "*")
public class PromptLimitedController {

    @Value("${app.bucket_capacity}")
    private int BUCKET_CAPACITY;

    @Value("${app.refill_amount}")
    private int REFILL_AMOUNT;

    @Value("${app.refill_time}")
    private int REFILL_TIME;

    private OpenAiService service;

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public PromptLimitedController(OpenAiService service) {
        System.out.println("PromptLimitedController");
        this.service=service;
    }

    private Bucket createNewBucket() {
        System.out.println("createNewBucket");
        Bandwidth limit = Bandwidth.classic(BUCKET_CAPACITY, Refill.greedy(REFILL_AMOUNT, Duration.ofMinutes(REFILL_TIME)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket getBucket(String key) {
        System.out.println("getBucket");
        return buckets.computeIfAbsent(key, k -> createNewBucket());
    }

    @GetMapping()
    public MyResponse getPromptLimited(@RequestParam String about, HttpServletRequest request) {
        System.out.println("getPromptLimited");
        String ip = request.getRemoteAddr();
        Bucket bucket = getBucket(ip);
        if (!bucket.tryConsume(1)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests, try again later");
        }
        return service.makeRequest(about, PromptController.SYSTEM_MESSAGE);
    }
}
