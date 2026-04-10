#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX 200

static int maxValue(int a, int b) {
    return (a > b) ? a : b;
}

void printDPTable(int dp[MAX][MAX], char *X, char *Y, int m, int n) {
    int i, j;
    printf("\nDP Table:\n\n      ");
    for (j = 0; j < n; j++) {
        printf("  %c", Y[j]);
    }
    printf("\n");

    for (i = 0; i <= m; i++) {
        if (i == 0) printf("   ");
        else printf("%c  ", X[i - 1]);

        for (j = 0; j <= n; j++) {
            printf("%2d ", dp[i][j]);
        }
        printf("\n");
    }
}

void printLCS(char *X, char *Y) {
    int m = (int)strlen(X);
    int n = (int)strlen(Y);
    int dp[MAX][MAX];
    int i, j;

    for (i = 0; i <= m; i++) {
        for (j = 0; j <= n; j++) {
            if (i == 0 || j == 0)
                dp[i][j] = 0;
            else if (X[i - 1] == Y[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = maxValue(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    printDPTable(dp, X, Y, m, n);

    int index = dp[m][n];
    char lcs[MAX];
    lcs[index] = '\0';

    i = m; j = n;
    while (i > 0 && j > 0) {
        if (X[i - 1] == Y[j - 1]) {
            lcs[index - 1] = X[i - 1];
            i--; j--; index--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    printf("\nLCS Length : %d\n", dp[m][n]);
    printf("LCS String : %s\n", lcs);
    float similarity = (2.0f * dp[m][n]) / (m + n) * 100;
    printf("Similarity : %.2f%%\n", similarity);
}

void plagiarismMode() {
    char str1[MAX], str2[MAX];
    printf("\n--- Plagiarism Detection ---\n");
    printf("Enter First Text: ");
    scanf(" %[^\n]", str1);
    printf("Enter Second Text: ");
    scanf(" %[^\n]", str2);
    printLCS(str1, str2);
}

int validateDNA(char *str) {
    int i;
    for (i = 0; str[i]; i++) {
        if (str[i] != 'A' && str[i] != 'C' && str[i] != 'G' && str[i] != 'T')
            return 0;
    }
    return 1;
}

void dnaMode() {
    char dna1[MAX], dna2[MAX];
    printf("\n--- DNA Sequencing ---\n");
    printf("Enter DNA Sequence 1: ");
    scanf("%s", dna1);
    printf("Enter DNA Sequence 2: ");
    scanf("%s", dna2);

    if (!validateDNA(dna1) || !validateDNA(dna2)) {
        printf("Invalid DNA Sequence!\n");
        return;
    }
    printLCS(dna1, dna2);
}

void fileComparisonMode() {
    char file1[MAX], file2[MAX];
    printf("\n--- File Comparison ---\n");
    printf("Enter First Code: ");
    scanf(" %[^\n]", file1);
    printf("Enter Second Code: ");
    scanf(" %[^\n]", file2);
    printLCS(file1, file2);
}

int main() {
    int choice;
    while (1) {
        printf("\n===== LCS Visualizer =====\n");
        printf("1. Plagiarism Detection\n");
        printf("2. DNA Sequencing\n");
        printf("3. File Comparison\n");
        printf("4. Exit\n");
        printf("Enter Choice: ");
        
        if (scanf("%d", &choice) != 1) {
            while(getchar() != '\n'); 
            continue;
        }

        switch (choice) {
            case 1: plagiarismMode(); break;
            case 2: dnaMode(); break;
            case 3: fileComparisonMode(); break;
            case 4: exit(0);
            default: printf("Invalid Choice\n");
        }
    }
    return 0;
}