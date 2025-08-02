# Makefile for feedback-widget

# Default configuration (can be overridden)
PORT ?= 8090
CONTAINER_NAME = feedback-widget-storyboard
IMAGE_NAME = feedback-widget-storyboard
# Default to not using a volume mount
USE_VOLUME ?= 0
# Default to not showing verbose output
VERBOSE ?= 0

# Colors for terminal output
GREEN := \033[0;32m
BLUE := \033[0;34m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m  # No Color

.PHONY: story story-build story-clean story-logs story-debug

# Main target to run the storyboard
story: story-build
	@echo -e "\n$(GREEN)Starting container...$(NC)"
	@if docker ps -a -q -f name=$(CONTAINER_NAME) | grep -q .; then \
		echo -e "$(GREEN)Stopping existing container...$(NC)"; \
		docker stop $(CONTAINER_NAME) > /dev/null; \
		docker rm $(CONTAINER_NAME) > /dev/null; \
	fi
	
	@# Determine if we should use volume mounting or not
	@if [ "$(USE_VOLUME)" = "1" ]; then \
		echo -e "$(YELLOW)Using volume mount to ensure files are available...$(NC)"; \
		docker run --name $(CONTAINER_NAME) -d -p $(PORT):80 -v $(shell pwd):/usr/share/nginx/html $(IMAGE_NAME) $(if $(filter 1,$(VERBOSE)),, > /dev/null); \
	else \
		docker run --name $(CONTAINER_NAME) -d -p $(PORT):80 $(IMAGE_NAME) $(if $(filter 1,$(VERBOSE)),, > /dev/null); \
	fi
	
	@if [ $$? -ne 0 ]; then \
		echo -e "$(RED)Error: Failed to start the container.$(NC)"; \
		exit 1; \
	fi
	
	@echo -e "\n$(GREEN)Success!$(NC) Storyboard is now running."
	@echo -e "Open your browser and navigate to: $(BLUE)http://localhost:$(PORT)$(NC)"
	@echo -e "\nTo stop the storyboard, run: $(BLUE)make story-clean$(NC)"
	@echo -e "To view logs, run: $(BLUE)make story-logs$(NC)"
	@echo -e "If you encounter issues, try: $(BLUE)make story USE_VOLUME=1$(NC)"
	@echo -e "For debugging help, run: $(BLUE)make story-debug$(NC)"

# Build the Docker image
story-build:
	@echo -e "\n$(GREEN)Building Docker image...$(NC)"
	@echo -e "$(YELLOW)Removing old image if it exists...$(NC)"
	@docker rmi $(IMAGE_NAME) 2>/dev/null || true
	@echo -e "$(GREEN)Building fresh image...$(NC)"
	@docker build --no-cache -t $(IMAGE_NAME) -f Dockerfile.storyboard . $(if $(filter 1,$(VERBOSE)),,> /dev/null) || \
		(echo -e "$(RED)Error: Docker build failed.$(NC)" && exit 1)

# Stop and remove the container
story-clean:
	@if docker ps -a -q -f name=$(CONTAINER_NAME) | grep -q .; then \
		echo -e "$(GREEN)Stopping and removing container...$(NC)"; \
		docker stop $(CONTAINER_NAME) > /dev/null; \
		docker rm $(CONTAINER_NAME) > /dev/null; \
		echo -e "$(GREEN)Container stopped and removed.$(NC)"; \
	else \
		echo -e "$(GREEN)No container found to clean up.$(NC)"; \
	fi

# View container logs
story-logs:
	@if docker ps -a -q -f name=$(CONTAINER_NAME) | grep -q .; then \
		echo -e "$(GREEN)Displaying logs for $(CONTAINER_NAME)...$(NC)"; \
		docker logs $(CONTAINER_NAME); \
	else \
		echo -e "$(RED)Container $(CONTAINER_NAME) not found.$(NC)"; \
	fi

# Debug container and files
story-debug:
	@echo -e "$(BLUE)=============== DEBUGGING INFORMATION ===============$(NC)"
	@echo -e "$(YELLOW)Container status:$(NC)"
	@docker ps -a | grep $(CONTAINER_NAME) || echo "No container found"
	
	@if docker ps -a -q -f name=$(CONTAINER_NAME) | grep -q .; then \
		echo -e "\n$(YELLOW)Nginx configuration:$(NC)"; \
		docker exec $(CONTAINER_NAME) cat /etc/nginx/conf.d/default.conf; \
		echo -e "\n$(YELLOW)Directory structure inside container:$(NC)"; \
		docker exec $(CONTAINER_NAME) ls -la /usr/share/nginx/html; \
		docker exec $(CONTAINER_NAME) ls -la /usr/share/nginx/html/examples 2>/dev/null || echo "examples directory not found"; \
		echo -e "\n$(YELLOW)Last few log entries:$(NC)"; \
		docker logs --tail 10 $(CONTAINER_NAME); \
	fi
	
	@echo -e "\n$(YELLOW)Local directory structure:$(NC)"
	@ls -la
	@ls -la examples 2>/dev/null || echo "examples directory not found"
	
	@echo -e "\n$(BLUE)==================== SUGGESTIONS ====================$(NC)"
	@echo -e "1. Try running with volume mount: $(BLUE)make story USE_VOLUME=1$(NC)"
	@echo -e "2. Verify examples directory exists and has storyboard.html"
	@echo -e "3. Check nginx configuration in Dockerfile.storyboard"
	@echo -e "$(BLUE)=====================================================$(NC)"

# Help target
help:
	@echo "Available targets:"
	@echo "  story       - Build and run the storyboard (default port: 8080)"
	@echo "               Options:"
	@echo "                - Override port: make story PORT=3000"
	@echo "                - Use volume mount: make story USE_VOLUME=1"
	@echo "                - Verbose output: make story VERBOSE=1"
	@echo "  story-build - Build the storyboard Docker image"
	@echo "  story-clean - Stop and remove the storyboard container"
	@echo "  story-logs  - Display logs from the running container"
	@echo "  story-debug - Show debugging information for troubleshooting"
	@echo "  help        - Show this help message"
