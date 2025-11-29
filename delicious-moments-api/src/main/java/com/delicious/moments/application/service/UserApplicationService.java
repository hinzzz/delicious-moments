package com.delicious.moments.application.service;

import com.delicious.moments.domain.user.aggregate.User;
import com.delicious.moments.domain.user.repository.UserRepository;
import com.delicious.moments.domain.user.valueobject.UserId;
import com.delicious.moments.interfaces.dto.request.UpdateProfileRequest;
import com.delicious.moments.interfaces.dto.response.UserDTO;
import com.delicious.moments.shared.exception.BusinessException;
import com.delicious.moments.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户应用服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserApplicationService {
    
    private final UserRepository userRepository;
    
    /**
     * 获取用户信息
     */
    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(UserId.of(userId))
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        return toDTO(user);
    }
    
    /**
     * 更新用户资料
     */
    @Transactional
    public void updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(UserId.of(userId))
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        user.updateProfile(request.getNickname(), request.getAvatarUrl(), request.getPhone());
        userRepository.save(user);
        
        log.info("用户资料更新成功: userId={}", userId);
    }
    
    /**
     * 根据OpenID获取或创建用户
     */
    @Transactional
    public User getOrCreateUser(String openId, String nickname, String avatarUrl) {
        return userRepository.findByOpenId(openId)
            .orElseGet(() -> {
                User newUser = User.create(openId, nickname, avatarUrl);
                userRepository.save(newUser);
                log.info("创建新用户: openId={}", openId);
                return newUser;
            });
    }
    
    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId().getValue());
        dto.setNickname(user.getNickname());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setPhone(user.getPhone());
        return dto;
    }
}
