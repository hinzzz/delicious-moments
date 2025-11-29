#!/bin/bash

# 创建 DDD 分层目录结构

BASE_DIR="src/main/java/com/delicious/moments"

# 表现层
mkdir -p ${BASE_DIR}/interfaces/controller
mkdir -p ${BASE_DIR}/interfaces/dto/request
mkdir -p ${BASE_DIR}/interfaces/dto/response
mkdir -p ${BASE_DIR}/interfaces/assembler
mkdir -p ${BASE_DIR}/interfaces/facade

# 应用层
mkdir -p ${BASE_DIR}/application/service
mkdir -p ${BASE_DIR}/application/event
mkdir -p ${BASE_DIR}/application/command

# 领域层 - 用户聚合
mkdir -p ${BASE_DIR}/domain/user/aggregate
mkdir -p ${BASE_DIR}/domain/user/entity
mkdir -p ${BASE_DIR}/domain/user/valueobject
mkdir -p ${BASE_DIR}/domain/user/repository
mkdir -p ${BASE_DIR}/domain/user/service
mkdir -p ${BASE_DIR}/domain/user/event

# 领域层 - 家庭聚合
mkdir -p ${BASE_DIR}/domain/family/aggregate
mkdir -p ${BASE_DIR}/domain/family/entity
mkdir -p ${BASE_DIR}/domain/family/valueobject
mkdir -p ${BASE_DIR}/domain/family/repository
mkdir -p ${BASE_DIR}/domain/family/service
mkdir -p ${BASE_DIR}/domain/family/event

# 领域层 - 菜谱聚合
mkdir -p ${BASE_DIR}/domain/dish/aggregate
mkdir -p ${BASE_DIR}/domain/dish/entity
mkdir -p ${BASE_DIR}/domain/dish/valueobject
mkdir -p ${BASE_DIR}/domain/dish/repository
mkdir -p ${BASE_DIR}/domain/dish/service
mkdir -p ${BASE_DIR}/domain/dish/event

# 领域层 - 菜单聚合
mkdir -p ${BASE_DIR}/domain/menu/aggregate
mkdir -p ${BASE_DIR}/domain/menu/entity
mkdir -p ${BASE_DIR}/domain/menu/valueobject
mkdir -p ${BASE_DIR}/domain/menu/repository
mkdir -p ${BASE_DIR}/domain/menu/service
mkdir -p ${BASE_DIR}/domain/menu/event

# 领域层 - 购物聚合
mkdir -p ${BASE_DIR}/domain/shopping/aggregate
mkdir -p ${BASE_DIR}/domain/shopping/entity
mkdir -p ${BASE_DIR}/domain/shopping/valueobject
mkdir -p ${BASE_DIR}/domain/shopping/repository
mkdir -p ${BASE_DIR}/domain/shopping/service
mkdir -p ${BASE_DIR}/domain/shopping/event

# 领域层 - 统计聚合
mkdir -p ${BASE_DIR}/domain/stats/aggregate
mkdir -p ${BASE_DIR}/domain/stats/entity
mkdir -p ${BASE_DIR}/domain/stats/valueobject
mkdir -p ${BASE_DIR}/domain/stats/repository
mkdir -p ${BASE_DIR}/domain/stats/service
mkdir -p ${BASE_DIR}/domain/stats/event

# 基础设施层
mkdir -p ${BASE_DIR}/infrastructure/persistence/mapper
mkdir -p ${BASE_DIR}/infrastructure/persistence/po
mkdir -p ${BASE_DIR}/infrastructure/persistence/repository
mkdir -p ${BASE_DIR}/infrastructure/external/wechat
mkdir -p ${BASE_DIR}/infrastructure/external/oss
mkdir -p ${BASE_DIR}/infrastructure/config
mkdir -p ${BASE_DIR}/infrastructure/common

# 共享内核
mkdir -p ${BASE_DIR}/shared/exception
mkdir -p ${BASE_DIR}/shared/util
mkdir -p ${BASE_DIR}/shared/constant

# 资源目录
mkdir -p src/main/resources/mapper
mkdir -p src/main/resources/db/migration
mkdir -p src/test/java/com/delicious/moments

echo "✅ DDD 项目结构创建完成！"
