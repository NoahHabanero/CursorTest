import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * GitHubService - GitHub API Integration
 * 
 * ⚠️ PROTECTED SERVICE - DO NOT EDIT VIA AI COMMANDS
 * This service handles:
 * - Creating GitHub issues for AI commands
 * - Triggering workflow runs
 * - Fetching deployment status
 * - Getting commit history
 */
@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private readonly REPO_OWNER = 'NoahHabanero';
  private readonly REPO_NAME = 'CursorTest';
  private readonly API_BASE = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  /**
   * Creates a GitHub issue with the user's command
   * The GitHub Action will pick up this issue and process it
   */
  async createIssue(command: string): Promise<{ success: boolean; issueUrl?: string; error?: string }> {
    // For now, we'll create an issue via the GitHub API
    // In production, you'd want to use a backend proxy to protect your token
    
    const issueTitle = `[AI Command] ${command.substring(0, 50)}${command.length > 50 ? '...' : ''}`;
    const issueBody = this.formatIssueBody(command);
    
    try {
      // Since we can't expose tokens in frontend code, 
      // we'll use a GitHub Action workflow_dispatch instead
      // For demo purposes, we'll simulate the request
      
      console.log('Creating issue with command:', command);
      console.log('Issue title:', issueTitle);
      console.log('Issue body:', issueBody);
      
      // In production, this would call a backend API or use a GitHub App
      // For now, we'll return a simulated success
      return {
        success: true,
        issueUrl: `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/issues`
      };
      
    } catch (error: any) {
      console.error('Failed to create issue:', error);
      return {
        success: false,
        error: error.message || 'Failed to create issue'
      };
    }
  }

  /**
   * Triggers the AI command workflow via workflow_dispatch
   */
  async triggerWorkflow(command: string): Promise<{ success: boolean; error?: string }> {
    try {
      // This would require authentication
      // In production, use a backend proxy or GitHub App
      console.log('Would trigger workflow with command:', command);
      
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Gets the latest workflow runs
   */
  async getWorkflowRuns(): Promise<any[]> {
    try {
      const url = `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/actions/runs`;
      const response = await firstValueFrom(this.http.get<any>(url));
      return response.workflow_runs || [];
    } catch (error) {
      console.error('Failed to fetch workflow runs:', error);
      return [];
    }
  }

  /**
   * Gets recent commits
   */
  async getCommits(count: number = 10): Promise<any[]> {
    try {
      const url = `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/commits?per_page=${count}`;
      const response = await firstValueFrom(this.http.get<any[]>(url));
      return response || [];
    } catch (error) {
      console.error('Failed to fetch commits:', error);
      return [];
    }
  }

  private formatIssueBody(command: string): string {
    return `
## AI Dashboard Edit Request

**Command:** ${command}

**Requested at:** ${new Date().toISOString()}

---

### Instructions for AI Agent

Please modify the \`src/app/components/dashboard-content/dashboard-content.component.ts\` file to implement the following changes:

> ${command}

### Constraints
- Only modify the \`DashboardContentComponent\`
- Do NOT modify protected components (BurgerMenu, CommandInput)
- Ensure the changes are valid Angular/TypeScript code
- Maintain the existing component structure
- Test that the application compiles successfully

### Labels
- \`ai-command\`
- \`auto-edit\`
`;
  }
}

