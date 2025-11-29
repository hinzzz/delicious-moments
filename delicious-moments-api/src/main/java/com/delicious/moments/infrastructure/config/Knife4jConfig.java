package com.delicious.moments.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Knife4j API文档配置
 */
@Configuration
public class Knife4jConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("食光集 API 文档")
                        .description("食光集家庭膳食管理系统后端API接口文档")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Delicious Team")
                                .email("team@delicious.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")));
    }
    
    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                .group("用户模块")
                .pathsToMatch("/users/**", "/auth/**")
                .build();
    }
    
    @Bean
    public GroupedOpenApi familyApi() {
        return GroupedOpenApi.builder()
                .group("家庭模块")
                .pathsToMatch("/families/**")
                .build();
    }
    
    @Bean
    public GroupedOpenApi dishApi() {
        return GroupedOpenApi.builder()
                .group("菜谱模块")
                .pathsToMatch("/dishes/**", "/categories/**", "/tags/**")
                .build();
    }
    
    @Bean
    public GroupedOpenApi menuApi() {
        return GroupedOpenApi.builder()
                .group("菜单模块")
                .pathsToMatch("/menus/**")
                .build();
    }
    
    @Bean
    public GroupedOpenApi shoppingApi() {
        return GroupedOpenApi.builder()
                .group("购物清单模块")
                .pathsToMatch("/shopping-list/**")
                .build();
    }
    
    @Bean
    public GroupedOpenApi statsApi() {
        return GroupedOpenApi.builder()
                .group("统计模块")
                .pathsToMatch("/stats/**", "/history/**")
                .build();
    }
}
