export const formatQuestions = (questions :Array<any>):Array<any> =>{
    let formattedQuestions:any = [];
    for(let question of questions){
        const questionTitle = question[0];
        const answers = [question[1],question[2],question[3],question[4]];
        const correctAnswer = Number.parseInt(question[5]);
        const formattedQuestion = {
            question:questionTitle,
            answers:answers,
            correctAnswer:correctAnswer
        }
        formattedQuestions.push(formattedQuestion);
    }

    return formattedQuestions;
}