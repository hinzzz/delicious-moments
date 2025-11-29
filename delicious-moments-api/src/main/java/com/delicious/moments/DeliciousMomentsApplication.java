package com.delicious.moments;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 食光集应用启动类
 * 
 * @author Delicious Team
 */
@SpringBootApplication
@MapperScan("com.delicious.moments.infrastructure.persistence.mapper")
public class DeliciousMomentsApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliciousMomentsApplication.class, args);
        System.out.println("""
            
            ========================================
            🍽️  食光集 API 启动成功！
            📖  API文档: http://localhost:8080/doc.html
            ========================================
            """);
    }
}
