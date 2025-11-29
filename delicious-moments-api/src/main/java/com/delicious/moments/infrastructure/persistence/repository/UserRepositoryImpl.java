package com.delicious.moments.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.delicious.moments.domain.user.aggregate.User;
import com.delicious.moments.domain.user.repository.UserRepository;
import com.delicious.moments.domain.user.valueobject.UserId;
import com.delicious.moments.infrastructure.persistence.mapper.UserMapper;
import com.delicious.moments.infrastructure.persistence.mapper.UserProfileMapper;
import com.delicious.moments.infrastructure.persistence.po.UserPO;
import com.delicious.moments.infrastructure.persistence.po.UserProfilePO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 用户仓储实现
 */
@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    
    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    
    @Override
    public Optional<User> findById(UserId userId) {
        UserPO userPO = userMapper.selectById(userId.getValue());
        if (userPO == null) {
            return Optional.empty();
        }
        
        UserProfilePO profilePO = userProfileMapper.selectOne(
            new LambdaQueryWrapper<UserProfilePO>()
                .eq(UserProfilePO::getUserId, userId.getValue())
        );
        
        return Optional.of(toDomain(userPO, profilePO));
    }
    
    @Override
    public Optional<User> findByOpenId(String openId) {
        UserPO userPO = userMapper.selectOne(
            new LambdaQueryWrapper<UserPO>()
                .eq(UserPO::getOpenid, openId)
        );
        
        if (userPO == null) {
            return Optional.empty();
        }
        
        UserProfilePO profilePO = userProfileMapper.selectOne(
            new LambdaQueryWrapper<UserProfilePO>()
                .eq(UserProfilePO::getUserId, userPO.getId())
        );
        
        return Optional.of(toDomain(userPO, profilePO));
    }
    
    @Override
    @Transactional
    public User save(User user) {
        UserPO userPO = toPO(user);
        
        if (user.getUserId() == null) {
            // 新增
            userMapper.insert(userPO);
            user.setUserId(UserId.of(userPO.getId()));
            
            // 保存用户资料
            UserProfilePO profilePO = toProfilePO(user);
            profilePO.setUserId(userPO.getId());
            userProfileMapper.insert(profilePO);
        } else {
            // 更新
            userMapper.updateById(userPO);
            
            UserProfilePO profilePO = toProfilePO(user);
            profilePO.setUserId(user.getUserId().getValue());
            userProfileMapper.update(profilePO,
                new LambdaQueryWrapper<UserProfilePO>()
                    .eq(UserProfilePO::getUserId, user.getUserId().getValue())
            );
        }
        
        return user;
    }
    
    @Override
    public void delete(UserId userId) {
        userMapper.deleteById(userId.getValue());
    }
    
    @Override
    public boolean existsByOpenId(String openId) {
        return userMapper.selectCount(
            new LambdaQueryWrapper<UserPO>()
                .eq(UserPO::getOpenid, openId)
        ) > 0;
    }
    
    private User toDomain(UserPO userPO, UserProfilePO profilePO) {
        User user = new User();
        user.setUserId(UserId.of(userPO.getId()));
        user.setOpenId(userPO.getOpenid());
        user.setUnionId(userPO.getUnionId());
        user.setVersion(userPO.getVersion());
        user.setCreatedAt(userPO.getCreatedAt());
        user.setUpdatedAt(userPO.getUpdatedAt());
        
        if (profilePO != null) {
            user.setNickname(profilePO.getNickname());
            user.setAvatarUrl(profilePO.getAvatarUrl());
            user.setPhone(profilePO.getPhone());
        }
        
        return user;
    }
    
    private UserPO toPO(User user) {
        UserPO po = new UserPO();
        if (user.getUserId() != null) {
            po.setId(user.getUserId().getValue());
        }
        po.setOpenid(user.getOpenId());
        po.setUnionId(user.getUnionId());
        po.setVersion(user.getVersion());
        return po;
    }
    
    private UserProfilePO toProfilePO(User user) {
        UserProfilePO po = new UserProfilePO();
        po.setNickname(user.getNickname());
        po.setAvatarUrl(user.getAvatarUrl());
        po.setPhone(user.getPhone());
        return po;
    }
}
