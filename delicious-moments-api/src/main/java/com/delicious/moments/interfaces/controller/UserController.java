package com.delicious.moments.interfaces.controller;

import com.delicious.moments.application.service.UserApplicationService;
import com.delicious.moments.interfaces.dto.request.UpdateProfileRequest;
import com.delicious.moments.interfaces.dto.response.Result;
import com.delicious.moments.interfaces.dto.response.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@Tag(name = "用户管理", description = "用户相关接口")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserApplicationService userApplicationService;
    
    @Operation(summary = "获取用户信息")
    @GetMapping("/profile")
    public Result<UserDTO> getUserProfile(@RequestParam Long userId) {
        UserDTO userDTO = userApplicationService.getUserProfile(userId);
        return Result.success(userDTO);
    }
    
    @Operation(summary = "更新用户资料")
    @PutMapping("/profile")
    public Result<Void> updateUserProfile(
            @RequestParam Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        userApplicationService.updateUserProfile(userId, request);
        return Result.success();
    }
}
