import words from "./words";

class GameLogic {
  private words: string[];
  private currentRound: number;
  private currentWordIndex: number;
  private errorCount: number;
  private successfulWords: number;
  private errorWords: number;
  private maxErrorCount: number;
  private wordWithMaxErrors: string;

  constructor() {
    this.words = words;
    this.currentRound = 1;
    this.currentWordIndex = 0;
    this.errorCount = 0;
    this.successfulWords = 0;
    this.errorWords = 0;
    this.maxErrorCount = 0;
    this.wordWithMaxErrors = "";
  }

  public getCurrentWord(): string {
    return this.words[this.currentWordIndex];
  }

  public checkSelectedLetter(
    selectedLetter: string,
    answerElement: HTMLElement
  ): boolean {
    const currentWord = this.getCurrentWord();
    const currentLetter = currentWord[answerElement.children.length];
    return selectedLetter === currentLetter;
  }

  public increaseErrorCount(): void {
    const currentWord = this.getCurrentWord();

    this.errorCount++;
    this.errorWords++;

    if (this.errorCount > this.maxErrorCount) {
      this.maxErrorCount = this.errorCount;
      this.wordWithMaxErrors = currentWord;
    }
  }

  public decreaseSuccessfulWordsCount(): void {
    this.successfulWords++;
  }

  public resetErrorCount(): void {
    this.errorCount = 0;
  }

  public getErrorCount(): number {
    return this.errorCount;
  }

  public moveToNextWord(): void {
    this.currentRound++;
    this.currentWordIndex++;
  }

  public resetToFirstWord(): void {
    this.currentWordIndex = 0;
    this.currentRound = 1;
    this.errorCount = 0;
  }

  public getCurrentRound(): number {
    return this.currentRound;
  }

  public getTotalRounds(): number {
    return this.words.length;
  }

  public getStatistics(): {
    successfulWords: number;
    errorWords: number;
    maxErrorCount: number;
    wordWithMaxErrors: string;
  } {
    return {
      successfulWords: this.successfulWords,
      errorWords: this.errorWords,
      maxErrorCount: this.maxErrorCount,
      wordWithMaxErrors: this.wordWithMaxErrors,
    };
  }
}

export default GameLogic;
