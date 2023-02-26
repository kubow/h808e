<script>
  import CalcBtn from '../808/CalcBtn.svelte';

  $: input = [];
  $: result = Number.isInteger(calculate(input)) ? calculate(input) : calculate(input).toFixed(5);

  function action(value) {
    const lastIndex = input.length - 1;
    const lastInputValue = input[lastIndex];
    const isLastInputNumber = !isNaN(input[lastIndex]);
    const isValueNumber = !isNaN(value);
    if (value === 'CE') {
      input = [];
      finalResult = 0;
    } else if (value === 'C') {
      input = [...input.slice(0, -2)];
    } else if (value === '←') {
      const updatedLastInputValue = lastInputValue.slice(0, -1);
      input =
        lastInputValue.length === 1
          ? [...input.slice(0, -1)]
          : [...input.slice(0, -1), updatedLastInputValue];
    } else if (value === '±') {
      let updatedLastInputValue;
      if (!isNaN(lastInputValue)) {
        updatedLastInputValue = `-${lastInputValue}`;
      } else {
        updatedLastInputValue = '-';
      }
      input = [...input.slice(0, -1), updatedLastInputValue];
    } else if (value === '.') {
      if (isLastInputNumber) {
        let updatedLastInputValue = `${lastInputValue}.`;
        input = [...input.slice(0, -1), updatedLastInputValue];
      }
    } else if (value === '=') {
      input = [`${result}`];
    } else if (isValueNumber && isLastInputNumber) {
      input = [...input.slice(0, -1), `${lastInputValue}${value}`];
    } else if (!isValueNumber && !isLastInputNumber) {
      input = [...input.slice(0, -1), value];
    } else {
      input = [...input, value];
    }
  };

  function calculate(input) {
    if (input.length === 0 || !Array.isArray(input)) return 0;

    const result = input.reduce((acc, val, idx, arr) => {
        const nextNumber = Number(arr[idx + 1]);

        if (isNaN(nextNumber)) return acc;

        switch (val) {
        case '+':
            return acc + nextNumber;
        case '−':
            return acc - nextNumber;
        case '×':
            return acc * nextNumber;
        case '÷':
            return acc / nextNumber;
        }

        return acc;
    }, Number(input[0]));

    return result;
    }
</script>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 2.4rem;
    color: #393a42;
    z-index: -1;
  }
  .result {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #e3f5fe;
    border-radius: 4px;
    text-align: end;
    background-color: #fafdff;
    color: #393a42;
  }
  .row1 {
    width: 250px;
    margin-bottom: 0.5rem;
  }
  .row2 {
    width: 250px;
    opacity: 0.5;
  }
  .controls {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
  .credits {
    font-size: 1.2rem;
  }
</style>

<main>
  <div class="result">
    <div class="row1">{input.join(' ')}</div>
    <div class="row2">{result}</div>
  </div>
  <div class="controls">
    <CalcBtn value={'CE'} {action} />
    <CalcBtn value={'C'} {action} />
    <CalcBtn value={'←'} {action} />
    <CalcBtn value={'÷'} {action} />

    <CalcBtn value={7} {action} />
    <CalcBtn value={8} {action} />
    <CalcBtn value={9} {action} />
    <CalcBtn value={'×'} {action} />

    <CalcBtn value={4} {action} />
    <CalcBtn value={5} {action} />
    <CalcBtn value={6} {action} />
    <CalcBtn value={'−'} {action} />

    <CalcBtn value={1} {action} />
    <CalcBtn value={2} {action} />
    <CalcBtn value={3} {action} />
    <CalcBtn value={'+'} {action} />

    <CalcBtn value={'±'} {action} />
    <CalcBtn value={0} {action} />
    <CalcBtn value={'.'} {action} />
    <CalcBtn value={'='} {action} />
  </div>
  <div class="credits">
    <p>
      designed and coded by
      <a href="https://tusnolobov.com/">Ivan Tusnolobov</a>
      |
      <a href="https://github.com/tusnolobov/svelte-calculator">github</a>
    </p>
  </div>
</main>