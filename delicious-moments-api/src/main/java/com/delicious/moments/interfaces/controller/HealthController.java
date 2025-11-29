package com.delicious.moments.interfaces.controller;

import com.delicious.moments.interfaces.dto.response.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 */
@Tag(name = "系统管理", description = "系统健康检查和状态查询")
@RestController
@RequestMapping("/health")
public class HealthController {
    
    @Operation(summary = "健康检查")
    @GetMapping
    public Result<Map<String, Object>> health() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("application", "delicious-moments-api");
        data.put("version", "1.0.0");
        data.put("timestamp", LocalDateTime.now());
        return Result.success(data);
    }
    
    @Operation(summary = "获取系统信息")
    @GetMapping("/info")
    public Result<Map<String, Object>> info() {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "食光集 API");
        data.put("description", "家庭膳食管理系统后端服务");
        data.put("version", "1.0.0");
        data.put("author", "Delicious Team");
        data.put("javaVersion", System.getProperty("java.version"));
        data.put("osName", System.getProperty("os.name"));
        return Result.success(data);
    }
}
