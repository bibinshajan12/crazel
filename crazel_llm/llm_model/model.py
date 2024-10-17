import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel

# Load model and tokenizer
model_name = 'distilgpt2'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

def generate_response(text):
    # Encode the input text
    inputs = tokenizer.encode(text, return_tensors='pt')

    # Generate a response with better parameters
    with torch.no_grad():
        outputs = model.generate(
            inputs, 
            max_length=len(inputs[0]) + 50,  # Generate up to 50 tokens more than input
            num_return_sequences=1,
            no_repeat_ngram_size=2,  # Avoid repeating n-grams
            do_sample=True,  # Enable sampling instead of greedy decoding
            top_k=50,  # Use top-k sampling
            top_p=0.95,  # Use top-p (nucleus) sampling
            temperature=0.7  # Introduce randomness in output
        )

    # Decode the generated output
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Post-process the response to ensure it’s relevant and not a repetition
    response = response[len(text):].strip()  # Remove the input part from the response
    return response
